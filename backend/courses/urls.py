from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, CourseViewSet, EnrollmentViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'', CourseViewSet, basename='course')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')

urlpatterns = [
    path('', include(router.urls)),
]
