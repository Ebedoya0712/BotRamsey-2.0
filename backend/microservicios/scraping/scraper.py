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


def obtener_receta(enlace):
    """
    Extrae los detalles de una receta desde un enlace específico.
    """
    sopa = obtener_contenido(enlace)
    if not sopa:
        return None

    titulo = sopa.find('h1', class_='titulo titulo--articulo').get_text(strip=True)
    ingredientes = [ing.get_text(strip=True) for ing in sopa.select('div.ingredientes label')]

    return {
        "titulo": titulo,
        "ingredientes": ingredientes,
    }
