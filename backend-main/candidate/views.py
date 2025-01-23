# views.py
from rest_framework import generics
from .models import Candidate
from .serializers import CandidateSerializer
from rest_framework.permissions import IsAuthenticated

class CandidateListCreate(generics.ListCreateAPIView):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    permission_classes = [IsAuthenticated]

class CandidateDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer

