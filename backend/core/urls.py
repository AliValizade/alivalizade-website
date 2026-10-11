from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SiteSettingsView, SkillViewSet, ExperienceViewSet, EducationViewSet, ContactView

router = DefaultRouter()
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'experiences', ExperienceViewSet, basename='experience')
router.register(r'educations', EducationViewSet, basename='education')

urlpatterns = [
    path('settings/', SiteSettingsView.as_view(), name='site-settings'),
    path('contact/', ContactView.as_view(), name='contact'),
    path('', include(router.urls)),
]
