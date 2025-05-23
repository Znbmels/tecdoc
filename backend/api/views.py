from rest_framework import generics, permissions, status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.core.mail import send_mail
from django.conf import settings
from .models import User, Document, DocumentCollaborator
from .serializers import UserSerializer, DocumentSerializer, DocumentCollaboratorSerializer

# Регистрация пользователя
@api_view(['POST'])
def register(request):
    from .serializers import UserSerializer
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "User registered", "user_id": user.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Кастомный сериализатор для логина с email
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        print("Received credentials:", attrs)
        email = attrs.get('email')
        user = User.objects.filter(email=email).first()
        if user:
            print(f"Found user: {user.username}")
            attrs['username'] = user.username
        else:
            print(f"User with email {email} not found")
            raise serializers.ValidationError({"email": "No active account found with the given email"})
        return super().validate(attrs)

# Кастомное представление для логина
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Список документов и создание нового
class DocumentListCreate(generics.ListCreateAPIView):
    from .serializers import DocumentSerializer
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return (Document.objects.filter(owner=user) | Document.objects.filter(collaborators__user=user)).distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

# Просмотр, редактирование и удаление документа
class DocumentDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return (Document.objects.filter(owner=user) | Document.objects.filter(collaborators__user=user, collaborators__role='edit')).distinct()
# Приглашение collaborator
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def invite_collaborator(request, id):
    from .serializers import DocumentCollaboratorSerializer
    try:
        document = Document.objects.get(id=id, owner=request.user)
        email = request.data.get('email')
        role = request.data.get('role', 'view')
        user = User.objects.get(email=email)
        collaborator, created = DocumentCollaborator.objects.get_or_create(user=user, document=document, role=role)
        send_mail(
            'Invitation to collaborate',
            f'You have been invited to collaborate on document "{document.title}" with {role} access.',
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )
        return Response({"message": "Invitation sent"}, status=status.HTTP_200_OK)
    except Document.DoesNotExist:
        return Response({"error": "Document not found or you are not the owner"}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)