# Generated by Django 5.1.2 on 2024-11-14 16:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('testdata', '0003_speise_delete_speisen'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.CharField(primary_key=True, serialize=False)),
                ('timestamp', models.DateTimeField()),
                ('Products', models.ManyToManyField(related_name='orders', to='testdata.speise')),
            ],
        ),
    ]
