# Generated by Django 5.1.2 on 2024-12-09 14:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('testdata', '0009_rename_attributes_product_attribute'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='menu_item_name',
            field=models.CharField(default=None),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='order',
            name='menu_item_price_in_cents',
            field=models.IntegerField(default=None),
            preserve_default=False,
        ),
    ]
