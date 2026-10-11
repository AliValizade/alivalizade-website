from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_featured', 'is_active', 'order', 'created_at')
    list_filter = ('is_featured', 'is_active')
    search_fields = ('title', 'title_en', 'short_description')
    prepopulated_fields = {'slug': ('title_en',)}
    ordering = ('order', '-created_at')
