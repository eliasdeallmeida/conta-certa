from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0003_category_color'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='monthly_limit',
            field=models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True),
        ),
    ] 