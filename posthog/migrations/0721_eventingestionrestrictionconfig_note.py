# Generated by Django 4.2.18 on 2025-05-02 16:51

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("posthog", "0720_add_hog_function_template_model"),
    ]

    operations = [
        migrations.AddField(
            model_name="eventingestionrestrictionconfig",
            name="note",
            field=models.TextField(
                blank=True, help_text="Optional note explaining why this restriction was put in place", null=True
            ),
        ),
    ]
