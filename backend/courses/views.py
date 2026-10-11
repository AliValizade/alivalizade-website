from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError

from .models import Category, Course, Enrollment
from .serializers import (
    CategorySerializer,
    CourseListSerializer,
    CourseDetailSerializer,
    EnrollmentSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    pagination_class = None


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """
    list:   /api/courses/
    detail: /api/courses/{slug}/
    """
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        qs = Course.objects.filter(is_published=True)
        featured = self.request.query_params.get('featured')
        category = self.request.query_params.get('category')
        if featured is not None:
            qs = qs.filter(is_featured=True)
        if category:
            qs = qs.filter(category__slug=category)
        return qs

    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        return CourseDetailSerializer


class EnrollmentViewSet(viewsets.ModelViewSet):
    """
    User enrollments (purchase history + new enrollments)
    """
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user).select_related('course')

    def perform_create(self, serializer):
        course = serializer.validated_data['course']
        if Enrollment.objects.filter(user=self.request.user, course=course).exists():
            raise ValidationError({'detail': 'You are already enrolled in this course.'})
        serializer.save(
            user=self.request.user,
            amount_paid=course.final_price,
            status='pending',
        )
