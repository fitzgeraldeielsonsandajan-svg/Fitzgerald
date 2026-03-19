from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Note, Category
from .serializers import NoteSerializer, CategorySerializer


class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all().order_by('-created_at')
    serializer_class = NoteSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
