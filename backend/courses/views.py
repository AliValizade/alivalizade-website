from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

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

    @action(detail=True, methods=['post'], url_path='pay-test')
    def pay_test(self, request, pk=None):
        """
        Simulated payment for development.
        Marks enrollment as completed without real gateway.
        """
        enrollment = self.get_object()

        if enrollment.status == 'completed':
            return Response({'detail': 'Already paid.', 'status': enrollment.status})

        if enrollment.status in ['cancelled', 'refunded']:
            return Response(
                {'detail': 'Cannot pay for this enrollment.'},
                status=400,
            )

        enrollment.status = 'completed'
        enrollment.paid_at = timezone.now()
        enrollment.transaction_id = f"TEST-{enrollment.id}-{int(timezone.now().timestamp())}"
        enrollment.save(update_fields=['status', 'paid_at', 'transaction_id'])

        return Response({
            'detail': 'Test payment successful.',
            'status': enrollment.status,
            'transaction_id': enrollment.transaction_id,
            'paid_at': enrollment.paid_at,
        })
