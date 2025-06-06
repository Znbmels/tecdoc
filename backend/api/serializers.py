from rest_framework import serializers
from .models import User, Document, DocumentCollaborator, ShareToken
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return super().create(validated_data)

class DocumentCollaboratorSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    document = serializers.StringRelatedField()

    class Meta:
        model = DocumentCollaborator
        fields = ['id', 'user', 'document', 'role']

class DocumentSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField()
    collaborators = DocumentCollaboratorSerializer(many=True, read_only=True)

    class Meta:
        model = Document
        fields = ['id', 'title', 'content', 'owner', 'collaborators', 'created_at', 'updated_at']

class ShareTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShareToken
        fields = ['id', 'document', 'email', 'token', 'created_at', 'is_active']

class ShareDocumentSerializer(serializers.Serializer):
    document_id = serializers.IntegerField()
    email = serializers.EmailField()