from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response

class ChatbotAPIView(APIView):
    def post(self, request):
        question = request.data.get('question', '')
        return Response({"answer": f"Procesando tu pregunta: {question}"})
