from rest_framework import generics
from .models import Note, Category
from .serializers import NoteSerializer, CategorySerializer

class Notegeneric(generics.ListCreateAPIView):
    queryset = Note.objects.all().order_by('-created_at')
    serializer_class = NoteSerializer


class Categorygeneric(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer