from rest_framework import serializers
from .models import User, Category, Transaction
from datetime import date


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para criação e validação de usuários.
    Inclui validação da confirmação de senha.
    
    Campos:
        id (int): ID do usuário.
        name (str): Nome completo do usuário.
        username (str): Nome da conta de usuário.
        email (str): E-mail único do usuário.
        password (str): Senha do usuário.
        confirm_password (str): Confirmação de senha do usuário.
    """
    password = serializers.CharField(label='Senha', write_only=True)
    confirm_password = serializers.CharField(label='Confirmar senha', write_only=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'username', 'email', 'password', 'confirm_password']
        extra_kwargs = {
            'name': {'label': 'Nome'}
        }
    
    def validate(self, attrs):
        """
        Valida os dados do usuário.
        
        Parâmetros:
            attrs (dict): Dados do usuário.
        Returns:
            dict: Dados validados.
        Raises:
            serializers.ValidationError: Se as senhas não coincidirem.
        """
        if attrs.get('password') != self.initial_data.get('confirm_password'):
            raise serializers.ValidationError({'confirm_password': "As senhas não coincidem."})
        return attrs
    
    def create(self, validated_data):
        """
        Cria um novo usuário removendo o campo de confirmação de senha.
        
        Parâmetros:
            validated_data (dict): Dados validados do usuário.
        Returns:
            User: Instância criada.
        """
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer para categorias, garantindo unicidade do nome por usuário.
    
    Campos:
        id (int): ID da categoria.
        name (str): Nome da categoria.
        user (User): Usuário dono da categoria.
        color (str): Cor da categoria.
        monthly_limit (Decimal): Meta de gasto mensal.
        current_spent (Decimal): Gasto do mês atual na categoria.
    """
    current_spent = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['user']

    def get_current_spent(self, obj):
        today = date.today()
        month = today.month
        year = today.year
        qs = obj.transactions.filter(
            transaction_type='expense',
            date__year=year,
            date__month=month
        )
        print(f"[DEBUG] Categoria {obj.name} tem {qs.count()} transações de despesa em {month}/{year}")
        return sum(t.value for t in qs)

    def validate_name(self, value):
        """
        Valida se o nome da categoria já existe para o usuário autenticado, exceto para a própria categoria em edição.
        """
        user = self.context['request'].user
        instance = getattr(self, 'instance', None)
        qs = Category.objects.filter(user=user, name=value)
        if instance is not None:
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise serializers.ValidationError('Já existe uma categoria com este nome para este usuário.')
        return value


class TransactionSerializer(serializers.ModelSerializer):
    """
    Serializer para transações financeiras, com validações de valor, data e categoria.
    
    Campos:
        id (int): ID da transação.
        description (str): Descrição.
        value (Decimal): Valor.
        date (date): Data.
        transaction_type (str): Tipo.
        category (int): ID da categoria.
        category_name (str): Nome da categoria (somente leitura).
        category_color (str): Cor da categoria (somente leitura).
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "id",
            "description",
            "value",
            "date",
            "transaction_type",
            "category",
            "category_name",
            "category_color",
        ]

    def validate_value(self, value):
        """
        Valida se o valor da transação é positivo.
        
        Parâmetros:
            value (Decimal): Valor informado.
        Returns:
            Decimal: Valor validado.
        Raises:
            serializers.ValidationError: Se o valor não for positivo.
        """
        if value <= 0:
            raise serializers.ValidationError('O valor deve ser positivo.')
        return value

    def validate_category(self, value):
        """
        Valida se a categoria pertence ao usuário autenticado.
        
        Parâmetros:
            value (Category): Categoria informada.
        Returns:
            Category: Categoria validada.
        Raises:
            serializers.ValidationError: Se a categoria não pertencer ao usuário.
        """
        user = self.context['request'].user
        if value and value.user != user:
            raise serializers.ValidationError('Categoria não pertence ao usuário autenticado.')
        return value

    def validate_date(self, value):
        """
        Valida se a data não é futura.
        
        Parâmetros:
            value (date): Data informada.
        Returns:
            date: Data validada.
        Raises:
            serializers.ValidationError: Se a data for futura.
        """
        if value > date.today():
            raise serializers.ValidationError('A data não pode ser futura.')
        return value
