from django.db import models

class Receta(models.Model):
    nombre = models.CharField(max_length=255)
    duracion = models.IntegerField()  # Duración en minutos
    dificultad = models.CharField(max_length=50)
    valoracion = models.DecimalField(max_digits=5, decimal_places=2)
    tipo = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre
