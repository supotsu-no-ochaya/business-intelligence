from django.test import TestCase
from rest_framework.test import APIClient
from testdata.models import Ingredient, Speise, SpeiseIngredient, OrderItem
from django.urls import reverse

class IngredientTestCase(TestCase):
    def setUp(self):
        # Create Ingredients
        self.flour = Ingredient.objects.create(name='Flour', unit='kg', quantity=10)
        self.egg = Ingredient.objects.create(name='Egg', unit='piece', quantity=30)
        self.sugar = Ingredient.objects.create(name='Sugar', unit='g', quantity=1000)

        # Create Speise (menu items)
        self.crepe = Speise.objects.create(name='Crepe', preis=3.5)

        # Associate ingredients with Speise using SpeiseIngredient
        SpeiseIngredient.objects.create(speise=self.crepe, ingredient=self.flour, portion=1, required_quantity=0.5)
        SpeiseIngredient.objects.create(speise=self.crepe, ingredient=self.egg, portion=1, required_quantity=1)
        SpeiseIngredient.objects.create(speise=self.crepe, ingredient=self.sugar, portion=1, required_quantity=10)

    def test_speise_ingredients_link(self):
        """Test that Speise correctly links to its ingredients."""
        ingredients = self.crepe.speiseingredient_set.all()
        self.assertEqual(ingredients.count(), 3)
        ingredient_names = [ing.ingredient.name for ing in ingredients]
        self.assertListEqual(ingredient_names, ['Flour', 'Egg', 'Sugar'])

    def test_ingredient_quantity_update_on_order(self):
        """Test that ordering a Speise reduces ingredient quantities."""
        # Simulate ordering 2 Crepes
        order_item = OrderItem.objects.create()
        order_item.Products.add(self.crepe)  # Add the Crepe to the order

        # Calculate expected quantities after order
        expected_flour = 10 - 0.5 * 2
        expected_egg = 30 - 1 * 2
        expected_sugar = 1000 - 10 * 2

        # Assert ingredient quantities
        self.flour.refresh_from_db()
        self.egg.refresh_from_db()
        self.sugar.refresh_from_db()
        self.assertEqual(self.flour.quantity, expected_flour)
        self.assertEqual(self.egg.quantity, expected_egg)
        self.assertEqual(self.sugar.quantity, expected_sugar)

    def test_get_ingredients_api(self):
        """Test the API endpoint to list ingredients."""
        client = APIClient()
        response = client.get(reverse('ingredient-list'))  # Assuming the endpoint is named 'ingredient-list'
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)  # Should return the 3 ingredients created in setUp

    def test_get_available_products_api(self):
        """Test the API endpoint to get available products and their portions."""
        client = APIClient()
        response = client.get(reverse('available-products'))  # Assuming the endpoint is named 'available-products'
        self.assertEqual(response.status_code, 200)

        # Verify the response structure
        data = response.data[0]
        self.assertIn('name', data)
        self.assertIn('price', data)
        self.assertIn('available_portions', data)
        self.assertIn('ingredients', data)

        # Check specific product details
        self.assertEqual(data['name'], 'Crepe')
        self.assertEqual(data['price'], 3.5)
        self.assertGreaterEqual(data['available_portions'], 0)

