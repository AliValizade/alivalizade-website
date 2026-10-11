# Ali Valizade Personal Website

Personal portfolio + resume + courses platform.

## Tech Stack

- **Backend**: Django 5/6 + Django REST Framework + PostgreSQL (SQLite for dev)
- **Frontend**: Next.js 15 (coming next) + TypeScript + Tailwind CSS
- **Auth**: django-allauth + JWT
- **i18n**: Persian (default) + English

## Project Structure

```
alivalizade-website/
├── backend/          # Django project
│   ├── config/       # Settings, urls
│   ├── core/         # SiteSettings, Skills, Experience, Education
│   ├── projects/     # Portfolio projects
│   ├── courses/      # Courses, Lessons, Enrollments
│   ├── blog/         # (future)
│   └── accounts/     # (future custom user if needed)
└── frontend/         # Next.js (next step)
```

## Current Status (Step 1 completed)

- [x] Django project initialized
- [x] Apps created: core, projects, courses, blog, accounts
- [x] Models defined for SiteSettings, Skill, Experience, Education, Project, Category, Course, Lesson, Enrollment
- [x] Admin registered
- [x] Migrations applied
- [x] Superuser created (admin / admin1234)

## How to run backend (development)

```bash
cd backend
python manage.py runserver
```

Admin panel: http://127.0.0.1:8000/admin/

## Next Steps

1. Create API serializers & viewsets
2. Setup Next.js frontend
3. Connect frontend to API
4. Implement auth flow
5. Course purchase + payment gateway
