from django.db.models import Count, Q, Sum
from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
import os
import json
from google import genai
from pydantic import BaseModel

from .models import LearningActivity, LearningGoal
from .serializers import LearningActivitySerializer, LearningGoalSerializer

from datetime import timedelta
from django.utils import timezone


class LearningGoalViewSet(viewsets.ModelViewSet):
    serializer_class = LearningGoalSerializer

    def get_queryset(self):
        return (
            LearningGoal.objects
            .annotate(
                total_hours=Sum("activities__hours"),
                activity_count=Count("activities"),
            )
            .order_by("-updated_at")
        )

    @action(detail=True, methods=["get"])
    def insight(self, request, pk=None):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return Response(
                {"error": "AI insights are currently unavailable due to missing configuration."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        goal = self.get_object()
        
        # Gather context
        recent_activities = list(goal.activities.order_by("-date")[:5].values("date", "hours", "notes"))
        
        prompt = f"""
        Analyze this learning goal and provide a concise, practical learning insight.
        Keep it short, direct, and useful. No generic motivational text.
        
        Goal: {goal.skill_name}
        Category: {goal.category}
        Progress: {goal.progress}%
        Status: {goal.status}
        Difficulty: {goal.difficulty}
        Notes: {goal.notes}
        Recent Activity: {recent_activities}
        
        Respond with exactly three points:
        1. Current learning assessment (1 brief sentence).
        2. One recommended next step (1 brief sentence).
        3. One practical resource/topic to focus on (short phrase).
        """
        
        class InsightSchema(BaseModel):
            assessment: str
            next_step: str
            resource_recommendation: str

        try:
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config={
                    'response_mime_type': 'application/json',
                    'response_schema': InsightSchema,
                },
            )
            
            insight_data = json.loads(response.text)
            return Response(insight_data)
        except Exception as e:
            return Response(
                {"error": "Failed to generate insight at this time."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class LearningActivityViewSet(viewsets.ModelViewSet):
    serializer_class = LearningActivitySerializer

    def get_queryset(self):
        queryset = LearningActivity.objects.select_related("goal")
        goal_id = self.request.query_params.get("goal")
        if goal_id is not None:
            queryset = queryset.filter(goal_id=goal_id)
        return queryset


class DashboardAPIView(generics.GenericAPIView):

    def get(self, request):
        goals = LearningGoal.objects.all()
        activities = LearningActivity.objects.select_related("goal")

        # Basic learning statistics
        stats = goals.aggregate(
            total_skills=Count("id"),
            completed=Count(
                "id",
                filter=Q(status=LearningGoal.Status.COMPLETED),
            ),
            in_progress=Count(
                "id",
                filter=Q(status=LearningGoal.Status.IN_PROGRESS),
            ),
            started=Count(
                "id",
                filter=Q(status=LearningGoal.Status.STARTED),
            ),
        )

        total_hours = activities.aggregate(
            total=Sum("hours")
        )["total"] or 0

        # Learning activity from the last 7 days
        week_ago = timezone.now().date() - timedelta(days=6)

        weekly_activities = activities.filter(
            date__gte=week_ago
        )

        weekly_hours = weekly_activities.aggregate(
            total=Sum("hours")
        )["total"] or 0

        active_days = weekly_activities.values(
            "date"
        ).distinct().count()

        # Average progress across all learning goals
        total_progress = goals.aggregate(
            total=Sum("progress")
        )["total"] or 0

        total_skills = stats["total_skills"]

        average_progress = (
            round(total_progress / total_skills)
            if total_skills
            else 0
        )

        # Hours spent by learning category
        category_breakdown = (
            goals
            .values("category")
            .annotate(hours=Sum("activities__hours"))
            .order_by("-hours")
        )

        # Recent learning sessions
        recent_activity = activities[:5]

        return Response({
            "stats": {
                **stats,
                "total_hours": total_hours,
            },
            "learning_pulse": {
                "weekly_hours": weekly_hours,
                "active_days": active_days,
                "average_progress": average_progress,
                "momentum": (
                    "Strong"
                    if active_days >= 5
                    else "Good"
                    if active_days >= 3
                    else "Getting started"
                ),
            },
            "category_breakdown": [
                {
                    "category": item["category"],
                    "hours": item["hours"] or 0,
                }
                for item in category_breakdown
            ],
            "recent_activity": [
                {
                    "id": activity.id,
                    "skill": activity.goal.skill_name,
                    "date": activity.date,
                    "hours": activity.hours,
                    "notes": activity.notes,
                }
                for activity in recent_activity
            ],
        })