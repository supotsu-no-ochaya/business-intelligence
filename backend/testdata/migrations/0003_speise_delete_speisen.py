# Generated by Django 5.1.2 on 2024-11-05 14:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('testdata', '0002_rename_ingredients_speisen_zutaten_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Speise',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField()),
                ('zutaten', models.TextField()),
                ('menge', models.IntegerField()),
                ('preis', models.FloatField()),
                ('rabatt', models.IntegerField()),
                ('r_preis', models.FloatField()),
                ('erstellt', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.DeleteModel(
            name='Speisen',
        ),
    ]
