# Generated by Django 5.1.2 on 2025-01-17 09:03

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('testdata', '0002_remove_speiseingredient_ingredient_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('base_stock', models.PositiveIntegerField(default=0)),
                ('unit', models.CharField(default='unit', max_length=50)),
                ('last_updated', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='recipe',
            name='erstellt',
        ),
        migrations.RemoveField(
            model_name='recipe',
            name='updated',
        ),
        migrations.RemoveField(
            model_name='recipeingredient',
            name='quantity',
        ),
        migrations.RemoveField(
            model_name='recipeingredient',
            name='unit',
        ),
        migrations.AddField(
            model_name='recipe',
            name='name_recipe',
            field=models.CharField(default=django.utils.timezone.now, max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='recipe',
            name='portion_quantity',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='recipeingredient',
            name='quantity_per_portion',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='speise',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='testdata.product'),
        ),
        migrations.AlterField(
            model_name='recipeingredient',
            name='ingredient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='testdata.ingredient'),
        ),
        migrations.AlterField(
            model_name='storageitem',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='testdata.ingredient'),
        ),
    ]
