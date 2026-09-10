from django.urls import path
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

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
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]

urlpatterns += router.urls