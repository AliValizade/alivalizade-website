from django.contrib import admin
from .models import Category, Course, Lesson, Enrollment


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    fields = ('title', 'order', 'video_url', 'is_preview', 'duration_minutes')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'order')
    prepopulated_fields = {'slug': ('name_en',)}
    search_fields = ('name', 'name_en')


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'price', 'discount_price', 'level', 'is_published', 'is_featured', 'order')
    list_filter = ('is_published', 'is_featured', 'level', 'category')
    search_fields = ('title', 'title_en', 'short_description')
    prepopulated_fields = {'slug': ('title_en',)}
    inlines = [LessonInline]
    ordering = ('order', '-created_at')


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'is_preview', 'duration_minutes')
    list_filter = ('course', 'is_preview')
    search_fields = ('title', 'title_en')
    ordering = ('course', 'order')


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'status', 'amount_paid', 'enrolled_at', 'paid_at')
    list_filter = ('status', 'course')
    search_fields = ('user__username', 'user__email', 'course__title', 'transaction_id')
    readonly_fields = ('enrolled_at',)
    ordering = ('-enrolled_at',)
