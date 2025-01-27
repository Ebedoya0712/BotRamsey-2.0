# microservicios/analisis/views.py

import pandas as pd
import os
import json
import matplotlib.pyplot as plt
import seaborn as sns
from django.shortcuts import render
from django.http import HttpResponse
from io import BytesIO
import matplotlib.ticker as ticker
from .procesar_datos import procesar_datos  # Asegúrate de que esta función esté en el archivo correcto

# Función para graficar
def graficar():
    clasificacion, df = cargar()

    procesar_datos(df)  # Procesar los datos antes de graficar

    # Generar el gráfico de "Dificultad vs Valoración"
    fig, ax = plt.subplots(figsize=(6, 4))
    sns.lineplot(data=df, x='Dificultad', y='Valoracion', ax=ax)
    ax.set_facecolor('black')
    plt.title("Dificultad vs Valoración", fontsize=12, color='white')
    plt.xlabel("Dificultad", fontsize=10, color='white')
    plt.ylabel("Valoración (%)", fontsize=10, color='white')

    # Guardar el gráfico en un buffer de bytes
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)  # Reposicionar el cursor al principio del archivo
    return buffer

# Vista para mostrar el gráfico
def analisis_view(request):
    buffer = graficar()

    # Generar el HTML que incluirá la imagen
    return HttpResponse(buffer.getvalue(), content_type='image/png')

def cargar():
    # Cargar los datos de clasificación en formato JSON
    with open('data/clasificacion.json', 'r') as f:
        clasificacion = json.load(f)

    # Cargar los datos de las recetas desde un archivo CSV
    ruta_archivo = 'data/recetas.csv' 
    if os.path.exists(ruta_archivo):
        df = pd.read_csv(ruta_archivo)
    else:
        df = None
    return clasificacion, df
