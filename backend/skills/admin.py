from django.contrib import admin

from .models import LearningActivity, LearningGoal


@admin.register(LearningGoal)
class LearningGoalAdmin(admin.ModelAdmin):
    list_display = (
        "skill_name",
        "category",
        "status",
        "progress",
        "difficulty",
        "updated_at",
    )
    list_filter = (
        "status",
        "difficulty",
        "resource_type",
        "category",
    )
    search_fields = ("skill_name", "platform")


@admin.register(LearningActivity)
class LearningActivityAdmin(admin.ModelAdmin):
    list_display = (
        "goal",
        "date",
        "hours",
        "created_at",
    )
    list_filter = ("date",)