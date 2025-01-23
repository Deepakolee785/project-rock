# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('candidates/', views.CandidateListCreate.as_view(), name='candidate-list-create'),
    path('candidates/<int:pk>/', views.CandidateDetail.as_view(), name='candidate-detail'),
]
