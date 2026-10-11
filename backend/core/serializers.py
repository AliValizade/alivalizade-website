from rest_framework import serializers
from .models import SiteSettings, Skill, Experience, Education
from .models import ContactMessage


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = [
            'site_name', 'site_name_en',
            'tagline', 'tagline_en',
            'about_short', 'about_short_en',
            'about_full', 'about_full_en',
            'profile_image',
            'resume_fa', 'resume_en',
            'email', 'phone', 'location',
            'github', 'linkedin', 'telegram',
        ]


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'name_en', 'level', 'category', 'order']


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            'id', 'title', 'title_en',
            'company', 'company_en',
            'location',
            'start_date', 'end_date', 'is_current',
            'description', 'description_en',
            'order',
        ]


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = [
            'id', 'degree', 'degree_en',
            'institution', 'institution_en',
            'field', 'field_en',
            'start_date', 'end_date', 'is_current',
            'description', 'description_en',
            'order',
        ]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'message']
