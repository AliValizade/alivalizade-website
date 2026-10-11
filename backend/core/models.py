from django.db import models
from django.utils.translation import gettext_lazy as _


class SiteSettings(models.Model):
    """Global site settings (singleton)"""
    site_name = models.CharField(_('Site Name'), max_length=100, default='Ali Valizade')
    site_name_en = models.CharField(_('Site Name (EN)'), max_length=100, default='Ali Valizade')
    tagline = models.CharField(_('Tagline'), max_length=255, blank=True)
    tagline_en = models.CharField(_('Tagline (EN)'), max_length=255, blank=True)
    about_short = models.TextField(_('Short About'), blank=True)
    about_short_en = models.TextField(_('Short About (EN)'), blank=True)
    about_full = models.TextField(_('Full About'), blank=True)
    about_full_en = models.TextField(_('Full About (EN)'), blank=True)
    profile_image = models.ImageField(_('Profile Image'), upload_to='profile/', blank=True, null=True)
    resume_fa = models.FileField(_('Resume FA'), upload_to='resumes/', blank=True, null=True)
    resume_en = models.FileField(_('Resume EN'), upload_to='resumes/', blank=True, null=True)
    email = models.EmailField(_('Email'), default='alivalizade@gmail.com')
    phone = models.CharField(_('Phone'), max_length=20, blank=True)
    location = models.CharField(_('Location'), max_length=100, default='Mashhad, Iran')
    github = models.URLField(_('GitHub'), blank=True, default='https://github.com/AliValizade')
    linkedin = models.URLField(_('LinkedIn'), blank=True, default='https://www.linkedin.com/in/alivalizade/')
    telegram = models.URLField(_('Telegram'), blank=True, default='https://t.me/titechco')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Site Settings')
        verbose_name_plural = _('Site Settings')

    def __str__(self):
        return self.site_name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class Skill(models.Model):
    LEVEL_CHOICES = (
        ('advanced', _('Advanced')),
        ('intermediate', _('Intermediate')),
        ('beginner', _('Beginner')),
    )
    name = models.CharField(_('Name'), max_length=100)
    name_en = models.CharField(_('Name (EN)'), max_length=100, blank=True)
    level = models.CharField(_('Level'), max_length=20, choices=LEVEL_CHOICES, default='intermediate')
    category = models.CharField(_('Category'), max_length=50, blank=True)
    order = models.PositiveIntegerField(_('Order'), default=0)
    is_active = models.BooleanField(_('Active'), default=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = _('Skill')
        verbose_name_plural = _('Skills')

    def __str__(self):
        return self.name


class Experience(models.Model):
    title = models.CharField(_('Title'), max_length=200)
    title_en = models.CharField(_('Title (EN)'), max_length=200, blank=True)
    company = models.CharField(_('Company'), max_length=200)
    company_en = models.CharField(_('Company (EN)'), max_length=200, blank=True)
    location = models.CharField(_('Location'), max_length=100, blank=True)
    start_date = models.DateField(_('Start Date'))
    end_date = models.DateField(_('End Date'), blank=True, null=True)
    is_current = models.BooleanField(_('Current'), default=False)
    description = models.TextField(_('Description'), blank=True)
    description_en = models.TextField(_('Description (EN)'), blank=True)
    order = models.PositiveIntegerField(_('Order'), default=0)

    class Meta:
        ordering = ['-start_date', 'order']
        verbose_name = _('Experience')
        verbose_name_plural = _('Experiences')

    def __str__(self):
        return f"{self.title} @ {self.company}"


class Education(models.Model):
    degree = models.CharField(_('Degree'), max_length=200)
    degree_en = models.CharField(_('Degree (EN)'), max_length=200, blank=True)
    institution = models.CharField(_('Institution'), max_length=200)
    institution_en = models.CharField(_('Institution (EN)'), max_length=200, blank=True)
    field = models.CharField(_('Field of Study'), max_length=200, blank=True)
    field_en = models.CharField(_('Field of Study (EN)'), max_length=200, blank=True)
    start_date = models.DateField(_('Start Date'))
    end_date = models.DateField(_('End Date'), blank=True, null=True)
    is_current = models.BooleanField(_('Current'), default=False)
    description = models.TextField(_('Description'), blank=True)
    description_en = models.TextField(_('Description (EN)'), blank=True)
    order = models.PositiveIntegerField(_('Order'), default=0)

    class Meta:
        ordering = ['-start_date', 'order']
        verbose_name = _('Education')
        verbose_name_plural = _('Educations')

    def __str__(self):
        return f"{self.degree} - {self.institution}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'

    def __str__(self):
        return f"{self.name} - {self.email}"
