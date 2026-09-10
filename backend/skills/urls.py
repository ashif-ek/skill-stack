from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    DashboardAPIView,
    LearningActivityViewSet,
    LearningGoalViewSet,
)

router = DefaultRouter()

router.register("goals", LearningGoalViewSet, basename="goal")
router.register("activities", LearningActivityViewSet, basename="activity")

urlpatterns = [
    path("dashboard/", DashboardAPIView.as_view(), name="dashboard"),
]

urlpatterns += router.urls