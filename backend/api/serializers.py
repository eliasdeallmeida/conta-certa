from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(label='Senha', write_only=True)
    confirm_password = serializers.CharField(label='Confirmar senha', write_only=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'username', 'email', 'password', 'confirm_password']
        extra_kwargs = {
            'name': {'label': 'Nome'}
        }
    
    def validate(self, attrs):
        if attrs.get('password') != self.initial_data.get('confirm_password'):
            raise serializers.ValidationError({'confirm_password': "As senhas não coincidem."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
