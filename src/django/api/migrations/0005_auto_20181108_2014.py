# Generated by Django 2.1.2 on 2018-11-08 20:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20181108_0019'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='member',
            name='id',
        ),
        migrations.AlterField(
            model_name='member',
            name='email',
            field=models.EmailField(max_length=254, primary_key=True, serialize=False),
        ),
    ]
