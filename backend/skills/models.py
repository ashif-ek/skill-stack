from django.db import models
from django.core.validators import MaxValueValidator
from django.core.validators import MinValueValidator

class LearningGoal(models.Model):
    class Status(models.TextChoices):
        STARTED = "started", "Started"
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed"

    class ResourceType(models.TextChoices):
        VIDEO = "video", "Video"
        COURSE = "course", "Course"
        ARTICLE = "article", "Article"

    class Difficulty(models.TextChoices):
        EASY = "easy", "Easy"
        MEDIUM = "medium", "Medium"
        HARD = "hard", "Hard"

    skill_name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    resource_type = models.CharField(
        max_length=20,
        choices=ResourceType.choices,
    )
    platform = models.CharField(max_length=50)
    resource_url = models.URLField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.STARTED,
    )

    # progress = models.PositiveSmallIntegerField(default=0)

    progress = models.PositiveSmallIntegerField(
    default=0,
    validators=[MaxValueValidator(100)],
)
    notes = models.TextField(blank=True)

    difficulty = models.CharField(
        max_length=10,
        choices=Difficulty.choices,
        default=Difficulty.MEDIUM,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return self.skill_name


class LearningActivity(models.Model):
    goal = models.ForeignKey(
        LearningGoal,
        on_delete=models.CASCADE,
        related_name="activities",
    )
    date = models.DateField()
    hours = models.DecimalField(
    max_digits=5,
    decimal_places=2,
    validators=[MinValueValidator(0)],
)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.goal.skill_name} - {self.date}"