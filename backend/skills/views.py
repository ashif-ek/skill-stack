from django.db.models import Count, Sum
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import LearningActivity, LearningGoal
from .serializers import (
    LearningActivitySerializer,
    LearningGoalSerializer,
)


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

    @action(detail=True, methods=["get", "post"])
    def activities(self, request, pk=None):
        goal = self.get_object()

        if request.method == "GET":
            activities = goal.activities.all()
            serializer = LearningActivitySerializer(
                activities,
                many=True,
            )
            return Response(serializer.data)

        serializer = LearningActivitySerializer(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save(goal=goal)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class LearningActivityViewSet(viewsets.ModelViewSet):
    serializer_class = LearningActivitySerializer

    def get_queryset(self):
        return LearningActivity.objects.select_related("goal")