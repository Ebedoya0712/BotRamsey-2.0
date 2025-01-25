import matplotlib.pyplot as plt
import seaborn as sns
import matplotlib.ticker as ticker
import streamlit as st

# Función para graficar
def graficar(prd, cargar, filtros):
    clasificacion, df = cargar()

    prd.procesar_datos(df)

    # Configuración de la interfaz en Streamlit
    st.title('Recetas y Valoración')

    # Sidebar para los filtros
    st.sidebar.header('Filtros')
    df = filtros(clasificacion, df)

    # Mostrar la tabla de datos de las recetas con la duración formateada
    st.subheader('Datos de las recetas')
    st.dataframe(df[['Recetas', 'Duracion', 'Dificultad', 'Valoracion', "Tipo"]])

    estilo()

    st.title("Análisis de Recetas")

    DuracionVsDificultad(df)
    DificultadVsValoracion(df)
    DuracionVsValoracion(df)
    barrasDificultad(df)


def formato_tiempo(ax):
    ax.xaxis.set_major_locator(ticker.MultipleLocator(120))
    ax.xaxis.set_major_formatter(ticker.FuncFormatter(lambda x, pos: f'{int(x // 60)}h {int(x % 60)}m' if (x >= 60) else f'{int(x)}m'))

def DificultadVsValoracion(df):
    st.subheader("Dificultad vs Valoración")
    fig, ax = plt.subplots(figsize=(10, 6))
    sns.lineplot(data=df, x='Dificultad', y='Valoracion', ax=ax)
    ax.set_facecolor('black')
    plt.title("Dificultad vs Valoración", fontsize=16, color='white')
    plt.xlabel("Dificultad", fontsize=14, color='white')
    plt.ylabel("Valoración (%)", fontsize=14, color='white')
    st.pyplot(fig)

def DuracionVsDificultad(df):
    st.subheader(f"Duración vs Dificultad")
    fig, ax = plt.subplots(figsize=(10, 6))
    sns.lineplot(data=df, x='Duracion', y="Dificultad", ax=ax)
    ax.set_facecolor('black')
    formato_tiempo(ax)
    plt.title(f"Duración vs Dificultad", fontsize=16, color='white')
    plt.xlabel("Duración", fontsize=14, color='white')
    plt.ylabel("Dificultad", fontsize=14, color='white')
    ax.invert_yaxis()
    st.pyplot(fig)

def DuracionVsValoracion(df):
    st.subheader(f"Duración vs Valoracion")
    fig, ax = plt.subplots(figsize=(10, 6))
    sns.lineplot(data=df, x='Duracion', y="Valoracion", ax=ax)
    ax.set_facecolor('black')
    formato_tiempo(ax)
    plt.title(f"Duración vs Valoracion", fontsize=16, color='white')
    plt.xlabel("Duración", fontsize=14, color='white')
    plt.ylabel("Valoracion", fontsize=14, color='white')
    st.pyplot(fig)

def barrasDificultad(df):
    st.subheader("Comparación de Niveles de Dificultad")
    fig, ax = plt.subplots(figsize=(10, 6))
    nivel_counts = df["Dificultad"].value_counts(sort= False)
    sns.barplot(data=nivel_counts, ax=ax)
    ax.set_facecolor('black')
    plt.title("Comparación de Niveles de Dificultad", fontsize=16, color='white')
    plt.xlabel("Nivel de Dificultad", fontsize=14, color='white')
    plt.ylabel("Cantidad de Recetas", fontsize=14, color='white')
    st.pyplot(fig)
