from django.shortcuts import render
from django.http import JsonResponse
from .scraper import buscar_receta

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

