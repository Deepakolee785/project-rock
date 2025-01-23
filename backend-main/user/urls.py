from django.urls import path
from .views import LoginView, UserRegistrationView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', UserRegistrationView.as_view(), name='register'),
]
