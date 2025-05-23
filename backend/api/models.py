from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

class Document(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class DocumentCollaborator(models.Model):
    ROLE_CHOICES = [
        ('view', 'View'),
        ('edit', 'Edit'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='collaborators')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='view')

    class Meta:
        unique_together = ('user', 'document')

    def __str__(self):
        return f"{self.user.email} - {self.document.title} ({self.role})"
