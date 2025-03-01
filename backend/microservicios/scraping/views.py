from django.shortcuts import render
from django.http import JsonResponse
from .scraper import buscar_receta
from .scraper import mostrar_pasos

def buscar_receta_view(request):
    """
    Endpoint que recibe una búsqueda y devuelve una receta.
    """
    query = request.GET.get('query')
    if not query:
        return JsonResponse({"error": "Por favor, proporciona un término de búsqueda."}, status=400)

    receta = buscar_receta(query)
    if receta:
        return JsonResponse(receta, safe=False)
    else:
        return JsonResponse({"error": "No se encontró ninguna receta."}, status=404)

def mostrar_pasos_view(request):

    query = request.GET.get('query')
    if not query:
        return JsonResponse({"error": "Por favor, proporciona un término de búsqueda."}, status=400)

    preparacion = mostrar_pasos(query)
    if preparacion:
        return JsonResponse(preparacion, safe=False)
    else:
        return JsonResponse({"error": "No se encontró ninguna receta."}, status=404)
