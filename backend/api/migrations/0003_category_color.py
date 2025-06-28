from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0002_category_transaction'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='color',
            field=models.CharField(max_length=7, default='#167ec5'),
        ),
    ] 