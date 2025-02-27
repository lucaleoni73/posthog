# Generated by Django 4.2.18 on 2025-02-03 16:24

from django.db import migrations, models
import posthog.models.utils


class Migration(migrations.Migration):
    dependencies = [
        ("posthog", "0558_alter_integration_kind"),
    ]

    operations = [
        migrations.AddField(
            model_name="team",
            name="api_query_rate_limit",
            field=models.CharField(
                blank=True,
                help_text="Custom rate limit for HogQL API queries in #requests/{sec,min,hour,day}",
                max_length=32,
                null=True,
                validators=[posthog.models.utils.validate_rate_limit],
            ),
        ),
    ]
