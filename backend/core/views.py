from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings

from .models import SiteSettings, Skill, Experience, Education
from .serializers import (
    SiteSettingsSerializer,
    SkillSerializer,
    ExperienceSerializer,
    EducationSerializer,
    ContactMessageSerializer,
)


class SiteSettingsView(APIView):
    """Return the single SiteSettings instance"""
    permission_classes = [AllowAny]

    def get(self, request):
        settings = SiteSettings.load()
        serializer = SiteSettingsSerializer(settings, context={'request': request})
        return Response(serializer.data)


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Skill.objects.filter(is_active=True)
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]
    pagination_class = None


class ExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [AllowAny]
    pagination_class = None


class EducationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [AllowAny]
    pagination_class = None


class ContactView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            message = serializer.save()

            # ارسال ایمیل (اختیاری - اگر SMTP تنظیم شده باشد)
            try:
                send_mail(
                    subject=f"پیام جدید از {message.name}",
                    message=f"نام: {message.name}\nایمیل: {message.email}\n\nپیام:\n{message.message}",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.DEFAULT_FROM_EMAIL],
                    fail_silently=True,
                )
            except Exception:
                pass  # اگر ایمیل تنظیم نشده بود، فقط ذخیره شود

            return Response(
                {"detail": "پیام شما با موفقیت ارسال شد."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)