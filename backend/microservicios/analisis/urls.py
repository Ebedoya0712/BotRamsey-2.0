# analisis/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('analisis/', views.analisis_recetas, name='analisis_recetas'),
]
