from rest_framework import serializers
from .models import Category, Course, Lesson, Enrollment


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'name_en', 'slug', 'description', 'description_en', 'order']


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'title_en', 'order',
            'video_url', 'duration_minutes',
            'is_preview', 'content', 'content_en',
        ]
        # Note: video_file and download_file are intentionally limited for security
        # Full access will be handled in a separate enrolled-user endpoint later


class CourseListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    final_price = serializers.DecimalField(max_digits=12, decimal_places=0, read_only=True)
    has_discount = serializers.BooleanField(read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'title_en', 'slug',
            'category',
            'short_description', 'short_description_en',
            'cover_image',
            'price', 'discount_price', 'final_price', 'has_discount',
            'level', 'duration_hours',
            'is_featured',
        ]


class CourseDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)
    final_price = serializers.DecimalField(max_digits=12, decimal_places=0, read_only=True)
    has_discount = serializers.BooleanField(read_only=True)
    lessons_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'title_en', 'slug',
            'category',
            'short_description', 'short_description_en',
            'description', 'description_en',
            'cover_image',
            'price', 'discount_price', 'final_price', 'has_discount',
            'level', 'duration_hours',
            'is_featured',
            'lessons', 'lessons_count',
            'created_at',
        ]

    def get_lessons_count(self, obj):
        return obj.lessons.count()


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.filter(is_published=True),
        source='course',
        write_only=True
    )

    class Meta:
        model = Enrollment
        fields = [
            'id', 'course', 'course_id',
            'status', 'amount_paid',
            'enrolled_at', 'paid_at',
        ]
        read_only_fields = ['status', 'amount_paid', 'enrolled_at', 'paid_at']
