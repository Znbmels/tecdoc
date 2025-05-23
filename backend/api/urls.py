from django.urls import path
from .views import (
    register,
    CustomTokenObtainPairView,
    DocumentListCreate,
    DocumentDetail,
    invite_collaborator,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', register, name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('documents/', DocumentListCreate.as_view(), name='document-list'),
    path('documents/<int:pk>/', DocumentDetail.as_view(), name='document-detail'),
    path('documents/<int:id>/invite/', invite_collaborator, name='invite-collaborator'),
]