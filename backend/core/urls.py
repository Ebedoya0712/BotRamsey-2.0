# urls.py principal

from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from microservicios.scraping.views import buscar_receta_view
from microservicios.accesibilidad.utils.voice_assistant import reproducir_audio
from microservicios.analisis.views import analisis

def home(request):
    return HttpResponse("Bienvenido a BotRamsey. Usa /api/chatbot/ para interactuar con el chatbot.")

def llamar_asistente_voz(request):
    """Vista que llama al asistente de voz desde el core."""
    texto = "Hola, Como oyes el CORE esta llamando a el asistente de voz y las subdependecias asociadas a ella "
    
    # Llamada a la función que reproduce el audio
    reproducir_audio(texto)
    
    return HttpResponse("El mensaje de voz ha sido reproducido desde el core.")

urlpatterns = [
    path('', home, name='home'),  # Redirige la raíz a una vista básica.
    path('admin/', admin.site.urls),
    path('asistente_voz/', llamar_asistente_voz, name='llamar_asistente_voz'),  # Ruta para el asistente de voz
    path('analisis/', include('microservicios.analisis.urls')),  # Incluir las rutas del microservicio 'analisis'
    path('analisis/', analisis, name='analisis'),
    path('api/buscar_receta/', buscar_receta_view, name='buscar_receta'),
]
