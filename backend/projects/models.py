from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify


class Project(models.Model):
    title = models.CharField(_('Title'), max_length=200)
    title_en = models.CharField(_('Title (EN)'), max_length=200, blank=True)
    slug = models.SlugField(_('Slug'), max_length=220, unique=True, blank=True)
    short_description = models.TextField(_('Short Description'), max_length=500)
    short_description_en = models.TextField(_('Short Description (EN)'), max_length=500, blank=True)
    description = models.TextField(_('Full Description'), blank=True)
    description_en = models.TextField(_('Full Description (EN)'), blank=True)
    image = models.ImageField(_('Cover Image'), upload_to='projects/', blank=True, null=True)
    technologies = models.CharField(_('Technologies'), max_length=300, help_text='Comma separated')
    github_url = models.URLField(_('GitHub URL'), blank=True)
    demo_url = models.URLField(_('Demo URL'), blank=True)
    is_featured = models.BooleanField(_('Featured'), default=False)
    is_active = models.BooleanField(_('Active'), default=True)
    order = models.PositiveIntegerField(_('Order'), default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = _('Project')
        verbose_name_plural = _('Projects')

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title_en or self.title)
            slug = base_slug
            counter = 1
            while Project.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def tech_list(self):
        return [t.strip() for t in self.technologies.split(',') if t.strip()]
