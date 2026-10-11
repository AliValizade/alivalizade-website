from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(_('Name'), max_length=100)
    name_en = models.CharField(_('Name (EN)'), max_length=100, blank=True)
    slug = models.SlugField(_('Slug'), max_length=120, unique=True, blank=True)
    description = models.TextField(_('Description'), blank=True)
    description_en = models.TextField(_('Description (EN)'), blank=True)
    order = models.PositiveIntegerField(_('Order'), default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_en or self.name)
        super().save(*args, **kwargs)


class Course(models.Model):
    LEVEL_CHOICES = (
        ('beginner', _('Beginner')),
        ('intermediate', _('Intermediate')),
        ('advanced', _('Advanced')),
    )
    title = models.CharField(_('Title'), max_length=250)
    title_en = models.CharField(_('Title (EN)'), max_length=250, blank=True)
    slug = models.SlugField(_('Slug'), max_length=270, unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='courses')
    short_description = models.TextField(_('Short Description'), max_length=500)
    short_description_en = models.TextField(_('Short Description (EN)'), max_length=500, blank=True)
    description = models.TextField(_('Full Description'), blank=True)
    description_en = models.TextField(_('Full Description (EN)'), blank=True)
    cover_image = models.ImageField(_('Cover Image'), upload_to='courses/covers/', blank=True, null=True)
    price = models.DecimalField(_('Price (Toman)'), max_digits=12, decimal_places=0, default=0)
    discount_price = models.DecimalField(_('Discount Price'), max_digits=12, decimal_places=0, blank=True, null=True)
    level = models.CharField(_('Level'), max_length=20, choices=LEVEL_CHOICES, default='beginner')
    duration_hours = models.PositiveIntegerField(_('Duration (hours)'), default=0)
    is_published = models.BooleanField(_('Published'), default=False)
    is_featured = models.BooleanField(_('Featured'), default=False)
    order = models.PositiveIntegerField(_('Order'), default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = _('Course')
        verbose_name_plural = _('Courses')

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title_en or self.title)
            slug = base_slug
            counter = 1
            while Course.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    @property
    def final_price(self):
        return self.discount_price if self.discount_price is not None else self.price

    @property
    def has_discount(self):
        return self.discount_price is not None and self.discount_price < self.price


class Lesson(models.Model):
    """Lessons inside a course - can be video or downloadable file"""
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(_('Title'), max_length=250)
    title_en = models.CharField(_('Title (EN)'), max_length=250, blank=True)
    order = models.PositiveIntegerField(_('Order'), default=0)
    video_url = models.URLField(_('Video URL (YouTube/Vimeo/Direct)'), blank=True)
    video_file = models.FileField(_('Video File'), upload_to='courses/videos/', blank=True, null=True)
    download_file = models.FileField(_('Downloadable File'), upload_to='courses/files/', blank=True, null=True)
    duration_minutes = models.PositiveIntegerField(_('Duration (minutes)'), default=0)
    is_preview = models.BooleanField(_('Free Preview'), default=False)
    content = models.TextField(_('Text Content'), blank=True)
    content_en = models.TextField(_('Text Content (EN)'), blank=True)

    class Meta:
        ordering = ['order']
        verbose_name = _('Lesson')
        verbose_name_plural = _('Lessons')

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Enrollment(models.Model):
    """User enrollment / purchase of a course"""
    STATUS_CHOICES = (
        ('pending', _('Pending Payment')),
        ('completed', _('Completed')),
        ('cancelled', _('Cancelled')),
        ('refunded', _('Refunded')),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    status = models.CharField(_('Status'), max_length=20, choices=STATUS_CHOICES, default='pending')
    amount_paid = models.DecimalField(_('Amount Paid'), max_digits=12, decimal_places=0, default=0)
    transaction_id = models.CharField(_('Transaction ID'), max_length=100, blank=True)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(_('Paid At'), blank=True, null=True)

    class Meta:
        unique_together = ('user', 'course')
        ordering = ['-enrolled_at']
        verbose_name = _('Enrollment')
        verbose_name_plural = _('Enrollments')

    def __str__(self):
        return f"{self.user} - {self.course.title} ({self.status})"
