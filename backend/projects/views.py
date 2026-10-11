from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Project
from .serializers import ProjectSerializer, ProjectListSerializer


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    list:   /api/projects/
    detail: /api/projects/{slug}/
    """
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        qs = Project.objects.filter(is_active=True)
        featured = self.request.query_params.get('featured')
        if featured is not None:
            qs = qs.filter(is_featured=True)
        return qs

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer
