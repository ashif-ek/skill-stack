from rest_framework import serializers

from .models import LearningActivity, LearningGoal


class LearningActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningActivity
        fields = [
            "id",
            "goal",
            "date",
            "hours",
            "notes",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_hours(self, value):
        if value <= 0:
            raise serializers.ValidationError("Hours must be strictly greater than 0.")
        return value

class LearningGoalSerializer(serializers.ModelSerializer):
    total_hours = serializers.DecimalField(
        max_digits=7,
        decimal_places=2,
        read_only=True,
    )
    activity_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = LearningGoal
        fields = [
            "id",
            "skill_name",
            "category",
            "resource_type",
            "platform",
            "resource_url",
            "status",
            "progress",
            "notes",
            "difficulty",
            "total_hours",
            "activity_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "total_hours",
            "activity_count",
            "created_at",
            "updated_at",
        ]

    def validate_progress(self, value):
        if not 0 <= value <= 100:
            raise serializers.ValidationError(
                "Progress must be between 0 and 100."
            )

        return value