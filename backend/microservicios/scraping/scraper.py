from bs4 import BeautifulSoup
import requests

def obtener_contenido(enlace):
    """
    Realiza una solicitud HTTP al enlace y devuelve un objeto BeautifulSoup.
    """
    try:
        respuesta = requests.get(enlace)
        respuesta.raise_for_status()
        return BeautifulSoup(respuesta.text, 'html.parser')
    except requests.RequestException:
        return None

def obtener_receta(enlace):
    """
    Extrae los detalles de una receta desde un enlace específico, incluyendo los pasos de preparación.
    """
    sopa = obtener_contenido(enlace)
    if not sopa:
        return None

    # Extraer el título de la receta
    titulo = sopa.find('h1', class_='titulo titulo--articulo').get_text(strip=True)

    # Extraer el tipo de receta
    tipo = sopa.find('a', class_='post-categoria-link').get_text(strip=True)

    # Extraer la valoración de la receta
    try:
        valoracion = sopa.find('div', class_='valoracion').get('style', '').split(':')[-1].strip()
    except AttributeError:
        valoracion = "50.00%"

    # Extraer las propiedades de la receta
    propiedades = [prop.get_text(strip=True) for prop in sopa.select('div.properties span')]

    # Extraer los ingredientes
    ingredientes = [ing.get_text(strip=True) for ing in sopa.select('div.ingredientes label')]

    # Extraer los pasos de preparación
    pasos = []
    pasos_container = sopa.find('div', class_='apartado')
    if pasos_container:
        for paso in pasos_container.find_all('li', class_='preparacion'):
            texto_paso = paso.get_text(strip=True)
            if texto_paso:
                pasos.append(texto_paso)

    return {
        "titulo": titulo,
        "tipo": tipo,
        "valoracion": valoracion,
        "propiedades": propiedades,
        "ingredientes": ingredientes,
        "pasos": pasos,
    }

def buscar_receta(busqueda):
    """
    Busca una receta en el sitio web basado en el término de búsqueda.
    """
    enlace_web = f"https://www.recetasgratis.net/busqueda?q={busqueda.replace(' ', '+')}"
    sopa = obtener_contenido(enlace_web)
    if not sopa:
        return None

    enlace = sopa.select_one('div.resultado.link a')
    if enlace:
        href = enlace.get('href')
        receta = obtener_receta(href)
        return receta
    return None