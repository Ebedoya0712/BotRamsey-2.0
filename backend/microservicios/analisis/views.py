# En views.py

from django.shortcuts import render
from microservicios.analisis.utils import filtros
import pandas as pd
import json
import os

def analisis(request):
    clasificacion, df = cargar()  # Cargar datos

    # Aplicar los filtros
    df = filtros(request, clasificacion, df)

    # Continuar con el análisis o visualización
    # Puedes agregar más lógica aquí para procesar los datos o mostrar algo en la interfaz
    context = {
        'df': df[['Recetas', 'Duracion', 'Dificultad', 'Valoracion', 'Tipo']]  # Enviar los datos filtrados
    }

    return render(request, 'analisis/resultado.html', context)

def cargar():
    # datos del formato de clasificacion en json
    with open('proyecto_recetas/data/clasificacion.json', 'r') as f:
        clasificacion = json.load(f)

    # datos del historial de recetas en csv
    ruta_archivo = 'proyecto_recetas/data/recetas.csv' 
    if os.path.exists(ruta_archivo):
        df = pd.read_csv(ruta_archivo)
    else:
        df = None
    return clasificacion, df
