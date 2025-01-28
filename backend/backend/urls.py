"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from testdata.auth.viewsets import LogoutView
from routers import router
from testdata import views
from testdata.views import (IncomeListView, IngredientUsageView, IngredientListView, 
                            PriceCurrencyView, PortionUnitView, RecipeIngredientView,
                            RecipeView,StorageItemListView, StorageLocationListView)
from drf_yasg import openapi
from rest_framework import permissions
from drf_yasg.views import get_schema_view

schema_view = get_schema_view(
   openapi.Info(
      title="Snippets API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('admin/', admin.site.urls),
    path('api/', include((router.urls, 'backend'), namespace='backend')),
    path('api/total_earnings', views.earnings, name="total_earnings"),
    path('upload-json/', views.UploadJsonView.as_view(), name='upload-json'),
    path('api/income/', IncomeListView.as_view(), name='income-list'),
    path('ingredients/', IngredientListView.as_view(), name='ingredient-list'),
    path('ingredients/<int:id>/', IngredientListView.as_view(), name='ingredient-detail'),  # For PUT and DELETE
    path('price-currencies/', PriceCurrencyView.as_view(), name='price_currency_list'),
    path('price-currencies/<int:id>/', PriceCurrencyView.as_view(), name='price_currency_detail'),
    path('portion-units/', PortionUnitView.as_view(), name='portion_unit_list'),
    path('portion-units/<str:id>/', PortionUnitView.as_view(), name='portion_unit_detail'),
    path('recipes/', RecipeView.as_view(), name='recipe_list'),
    path('recipes/<int:id>/', RecipeView.as_view(), name='recipe_detail'),
    path('recipe-ingredients/', RecipeIngredientView.as_view(), name='recipe_ingredient_list'),
    path('recipe-ingredients/<int:id>/', RecipeIngredientView.as_view(), name='recipe_ingredient_detail'),
    path('api/ingredient-usage/', IngredientUsageView.as_view(), name='ingredient-usage'),
    path('storage-location/', StorageLocationListView.as_view(), name='storage_location'),
    path('storage-location/<str:id>/', StorageLocationListView.as_view(), name='storage_location'),
    path('storage-location/<str:id>/', StorageLocationListView.as_view(), name='storage_location'),
    path('storage-item/', StorageItemListView.as_view(), name='storage_item'),
    path('storage-item/<str:id>/', StorageItemListView.as_view(), name='storage-item-detail'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
]