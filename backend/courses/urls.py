from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, CourseViewSet, EnrollmentViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')
router.register(r'', CourseViewSet, basename='course')

urlpatterns = [
    path('', include(router.urls)),
]
