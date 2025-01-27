# microservicios/analisis/procesar_datos.py

import pandas as pd

def procesar_datos(df):
    """
    Función que procesa el DataFrame de recetas.
    Realiza transformaciones básicas de limpieza y cálculo.
    """
    # Verifica si el DataFrame no está vacío
    if df is not None:
        # Limpiar columnas vacías
        df = df.dropna(how='all', axis=1)  # Eliminar columnas vacías

        # Convertir las columnas necesarias a tipos de datos apropiados
        df['Duracion'] = pd.to_numeric(df['Duracion'], errors='coerce')
        df['Dificultad'] = df['Dificultad'].fillna('media')  # Rellenar valores nulos de dificultad con 'media'
        df['Valoracion'] = pd.to_numeric(df['Valoracion'], errors='coerce')

        # Asegúrate de que las columnas sean del tipo adecuado
        df['Recetas'] = df['Recetas'].astype(str)
        df['Tipo'] = df['Tipo'].astype(str)

        # Eliminar filas con valores nulos en columnas clave
        df = df.dropna(subset=['Recetas', 'Duracion', 'Dificultad', 'Valoracion', 'Tipo'])

        # Aquí puedes agregar más transformaciones o validaciones de los datos

        # Normalización de la columna de 'Duracion' (Ejemplo: convertir a minutos)
        df['Duracion'] = df['Duracion'] / 60  # Convertir duración a minutos, si está en segundos

        # Otras transformaciones o cálculos adicionales que necesites
        # Ejemplo: Clasificación de 'Valoracion'
        df['Clasificacion'] = df['Valoracion'].apply(lambda x: 'Alta' if x >= 4 else 'Baja')

        # Retornar el DataFrame procesado
        return df
    else:
        return None
