from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    technologies_list = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'title_en', 'slug',
            'short_description', 'short_description_en',
            'description', 'description_en',
            'image',
            'technologies', 'technologies_list',
            'github_url', 'demo_url',
            'is_featured', 'order',
            'created_at',
        ]
        read_only_fields = ['slug', 'created_at']

    def get_technologies_list(self, obj):
        return obj.tech_list()


class ProjectListSerializer(serializers.ModelSerializer):
    """Lighter serializer for list views"""
    technologies_list = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'title_en', 'slug',
            'short_description', 'short_description_en',
            'image',
            'technologies_list',
            'github_url', 'demo_url',
            'is_featured',
        ]

    def get_technologies_list(self, obj):
        return obj.tech_list()
