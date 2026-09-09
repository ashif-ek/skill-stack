from rest_framework.routers import DefaultRouter

from .views import LearningActivityViewSet, LearningGoalViewSet


router = DefaultRouter()

router.register(
    r"goals",
    LearningGoalViewSet,
    basename="learning-goal",
)

router.register(
    r"activities",
    LearningActivityViewSet,
    basename="learning-activity",
)

urlpatterns = router.urls