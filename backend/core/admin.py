from django.contrib import admin
from .models import SiteSettings, Skill, Experience, Education
from .models import SiteSettings, Skill, Experience, Education, ContactMessage


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'level', 'category', 'order', 'is_active')
    list_filter = ('level', 'category', 'is_active')
    search_fields = ('name', 'name_en')
    ordering = ('order',)


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'start_date', 'end_date', 'is_current', 'order')
    list_filter = ('is_current',)
    search_fields = ('title', 'company', 'title_en', 'company_en')
    ordering = ('-start_date',)


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('degree', 'institution', 'start_date', 'end_date', 'is_current')
    list_filter = ('is_current',)
    search_fields = ('degree', 'institution', 'degree_en', 'institution_en')
    ordering = ('-start_date',)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('name', 'email', 'message', 'created_at')
