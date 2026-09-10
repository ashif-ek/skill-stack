from django.db.models import Count, Q, Sum
from rest_framework import generics, viewsets
from rest_framework.response import Response

from .models import LearningActivity, LearningGoal
from .serializers import LearningActivitySerializer, LearningGoalSerializer


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


class LearningActivityViewSet(viewsets.ModelViewSet):
    serializer_class = LearningActivitySerializer

    def get_queryset(self):
        return LearningActivity.objects.select_related("goal")


class DashboardAPIView(generics.GenericAPIView):

    def get(self, request):
        goals = LearningGoal.objects.all()
        activities = LearningActivity.objects.select_related("goal")

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

        category_breakdown = (
            goals
            .values("category")
            .annotate(hours=Sum("activities__hours"))
            .order_by("-hours")
        )

        return Response({
            "stats": {
                **stats,
                "total_hours": total_hours,
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
                for activity in activities[:5]
            ],
        })