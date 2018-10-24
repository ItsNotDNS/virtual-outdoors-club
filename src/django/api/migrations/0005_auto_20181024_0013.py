# Generated by Django 2.1.1 on 2018-10-24 06:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_reservation_gear'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gear',
            name='condition',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.Condition'),
        ),
        migrations.AlterField(
            model_name='gear',
            name='version',
            field=models.IntegerField(default=1),
        ),
        migrations.RemoveField(
            model_name='reservation',
            name='gear',
        ),
        migrations.AddField(
            model_name='reservation',
            name='gear',
            field=models.ManyToManyField(to='api.Gear'),
        ),
    ]
