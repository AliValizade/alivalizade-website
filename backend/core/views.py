from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
import logging
from django.core.mail import EmailMessage
from django.conf import settings

from .models import SiteSettings, Skill, Experience, Education
from .serializers import (
    SiteSettingsSerializer,
    SkillSerializer,
    ExperienceSerializer,
    EducationSerializer,
    ContactMessageSerializer,
)

logger = logging.getLogger(__name__)


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

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Save the message first; email failure must not lose it.
        message = serializer.save()

        try:
            email = EmailMessage(
                subject=f"پیام جدید از {message.name}",
                body=(
                    f"نام: {message.name}\n"
                    f"ایمیل: {message.email}\n\n"
                    f"پیام:\n{message.message}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.CONTACT_NOTIFICATION_EMAIL],
                reply_to=[message.email],
            )

            email.send(fail_silently=False)

        except Exception:
            logger.exception(
                "Failed to send contact notification email."
            )

        return Response(
            {"detail": "پیام شما با موفقیت ثبت شد."},
            status=status.HTTP_201_CREATED,
        )

    