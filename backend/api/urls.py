from django.urls import path
from .views import (
    register,
    CustomTokenObtainPairView,
    DocumentListCreate,
    DocumentDetail,
    invite_collaborator,
    share_document,
    retrieve_shared_document,
    download_document,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', register, name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('documents/', DocumentListCreate.as_view(), name='document-list'),
    path('documents/<int:pk>/download/', download_document, name='download-document'),
    path('documents/<int:pk>/', DocumentDetail.as_view(), name='document-detail'),
    path('documents/<int:id>/invite/', invite_collaborator, name='invite-collaborator'),
    path('share/', share_document, name='share-document'),
    path('shared-document/<uuid:token>/', retrieve_shared_document, name='retrieve-shared-document'),
]