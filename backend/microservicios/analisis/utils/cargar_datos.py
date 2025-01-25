import pandas as pd
import json
import os

def cargar():
    # datos del formato de clasificacion en json
    with open('proyecto_recetas/data/clasificacion.json', 'r') as f:
        clasificacion = json.load(f)

    # datos del historial de recetas en csv
    ruta_archivo = 'proyecto_recetas/data/recetas.csv' 
    if os.path.exists(ruta_archivo):
        df = pd.read_csv(ruta_archivo)
    else:
        st.subheader("No hay datos que analizar")
        df = None
    return clasificacion, df
