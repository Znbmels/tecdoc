from django.contrib import admin
from .models import User, Document, DocumentCollaborator

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'is_staff')
    search_fields = ('email', 'username')

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'created_at', 'updated_at')
    list_filter = ('owner', 'created_at')
    search_fields = ('title',)

@admin.register(DocumentCollaborator)
class DocumentCollaboratorAdmin(admin.ModelAdmin):
    list_display = ('user', 'document', 'role')
    list_filter = ('role',)
    search_fields = ('user__email', 'document__title')