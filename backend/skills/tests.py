from datetime import timedelta
from decimal import Decimal
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from .models import LearningGoal, LearningActivity

class SkillStackAPITests(APITestCase):
    def setUp(self):
        self.goal1 = LearningGoal.objects.create(
            skill_name="React",
            category="Frontend",
            resource_type=LearningGoal.ResourceType.COURSE,
            platform="Frontend Masters",
            status=LearningGoal.Status.IN_PROGRESS,
            progress=50
        )
        self.goal2 = LearningGoal.objects.create(
            skill_name="Django",
            category="Backend",
            resource_type=LearningGoal.ResourceType.VIDEO,
            platform="YouTube",
            status=LearningGoal.Status.STARTED,
            progress=10
        )
        
        self.activity1 = LearningActivity.objects.create(
            goal=self.goal1,
            date=timezone.now().date(),
            hours=Decimal("2.5"),
            notes="Hooks"
        )
        self.activity2 = LearningActivity.objects.create(
            goal=self.goal1,
            date=timezone.now().date() - timedelta(days=1),
            hours=Decimal("1.5"),
            notes="State management"
        )

    def test_get_goals(self):
        response = self.client.get("/api/goals/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
    def test_get_goal_details_with_annotations(self):
        response = self.client.get(f"/api/goals/{self.goal1.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check annotations
        self.assertEqual(response.data["total_hours"], "4.00")
        self.assertEqual(response.data["activity_count"], 2)

    def test_patch_goal_progress_and_status(self):
        payload = {
            "progress": 100,
            "status": LearningGoal.Status.COMPLETED
        }
        response = self.client.patch(f"/api/goals/{self.goal2.id}/", payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.goal2.refresh_from_db()
        self.assertEqual(self.goal2.progress, 100)
        self.assertEqual(self.goal2.status, LearningGoal.Status.COMPLETED)

    def test_patch_goal_invalid_progress(self):
        payload = {"progress": 110}
        response = self.client.patch(f"/api/goals/{self.goal2.id}/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_goal_cascade(self):
        goal_id = self.goal1.id
        response = self.client.delete(f"/api/goals/{goal_id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(LearningGoal.objects.filter(id=goal_id).exists())
        self.assertFalse(LearningActivity.objects.filter(goal_id=goal_id).exists())

    def test_get_activities_filtering(self):
        response = self.client.get(f"/api/activities/?goal={self.goal1.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        # Check ordering (newest first)
        self.assertEqual(response.data[0]["id"], self.activity1.id)
        self.assertEqual(response.data[1]["id"], self.activity2.id)

    def test_post_activity_success(self):
        payload = {
            "goal": self.goal2.id,
            "date": timezone.now().date().isoformat(),
            "hours": "1.25",
            "notes": "Testing"
        }
        response = self.client.post("/api/activities/", payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(LearningActivity.objects.filter(goal=self.goal2).count(), 1)

    def test_post_activity_invalid_hours(self):
        payload = {
            "goal": self.goal2.id,
            "date": timezone.now().date().isoformat(),
            "hours": "-1.00"
        }
        response = self.client.post("/api/activities/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("hours", response.data)
        
        payload["hours"] = "0"
        response = self.client.post("/api/activities/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("hours", response.data)

    def test_dashboard_api(self):
        response = self.client.get("/api/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify basic shape
        self.assertIn("stats", response.data)
        self.assertIn("learning_pulse", response.data)
        self.assertIn("category_breakdown", response.data)
        self.assertIn("recent_activity", response.data)
        
        stats = response.data["stats"]
        self.assertEqual(stats["total_skills"], 2)
        self.assertEqual(stats["total_hours"], 4.00)
        
        pulse = response.data["learning_pulse"]
        self.assertEqual(pulse["weekly_hours"], 4.00)
        self.assertEqual(pulse["average_progress"], 30) # (50 + 10) / 2
