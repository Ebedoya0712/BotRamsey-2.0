import os
import pandas as pd
import json
from django.shortcuts import render
from django.http import JsonResponse
from .utils.data_processing import procesar_datos, formato_tiempo
import matplotlib.pyplot as plt
import seaborn as sns
from io import BytesIO
import base64

def analisis_recetas(request):
    # Cargar datos
    clasificacion, df = cargar_datos()
    if df is None:
        return JsonResponse({"error": "No hay datos disponibles para analizar"}, status=404)

    # Procesar datos
    df = procesar_datos(df)

    # Aplicar filtros
    dificultad = request.GET.get('dificultad', 'todas')
    tipo = request.GET.get('tipo', 'todas')
    df = filtrar_datos(clasificacion, df, dificultad, tipo)

    # Generar gráficos
    graficos = generar_graficos(df)

    # Preparar respuesta
    respuesta = {
        "recetas": df[['Recetas', 'Duracion', 'Dificultad', 'Valoracion', "Tipo"]].to_dict(orient='records'),
        "graficos": graficos,
    }
    return JsonResponse(respuesta)

def cargar_datos():
    try:
        with open('proyecto_recetas/data/clasificacion.json', 'r') as f:
            clasificacion = json.load(f)

        ruta_archivo = 'proyecto_recetas/data/recetas.csv'
        if os.path.exists(ruta_archivo):
            df = pd.read_csv(ruta_archivo)
            return clasificacion, df
    except Exception as e:
        print(f"Error al cargar datos: {e}")
    return None, None

def filtrar_datos(clasificacion, df, dificultad, tipo):
    if dificultad != 'todas':
        df = df[df['Dificultad'] == dificultad]

    if tipo != 'todas':
        df = df[df['Tipo'].isin(clasificacion.get(tipo, []))]

    return df

def generar_graficos(df):
    sns.set_style("darkgrid")
    sns.set_palette("bright")

    graficos = {}
    figuras = {
        "Dificultad vs Valoracion": dificultad_vs_valoracion,
        "Duracion vs Dificultad": duracion_vs_dificultad,
        "Duracion vs Valoracion": duracion_vs_valoracion,
        "Comparacion de Dificultad": barras_dificultad,
    }

    for nombre, funcion in figuras.items():
        fig, ax = plt.subplots(figsize=(10, 6))
        funcion(df, ax)
        buffer = BytesIO()
        plt.savefig(buffer, format="png", bbox_inches="tight")
        buffer.seek(0)
        graficos[nombre] = base64.b64encode(buffer.getvalue()).decode('utf-8')
        buffer.close()
        plt.close(fig)

    return graficos

def dificultad_vs_valoracion(df, ax):
    sns.lineplot(data=df, x='Dificultad', y='Valoracion', ax=ax)

def duracion_vs_dificultad(df, ax):
    sns.lineplot(data=df, x='Duracion', y='Dificultad', ax=ax)
    formato_tiempo(ax)

def duracion_vs_valoracion(df, ax):
    sns.lineplot(data=df, x='Duracion', y='Valoracion', ax=ax)
    formato_tiempo(ax)

def barras_dificultad(df, ax):
    nivel_counts = df["Dificultad"].value_counts(sort=False)
    sns.barplot(x=nivel_counts.index, y=nivel_counts.values, ax=ax)
