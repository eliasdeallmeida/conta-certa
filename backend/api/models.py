from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Modelo customizado de usuário que utiliza e-mail e senha para autenticação.
    
    Atributos:
        name (str): Nome completo do usuário.
        username (str): Nome da conta de usuário.
        email (str): E-mail único do usuário.
        password (str): Senha do usuário.
        confirm_password (str): Confirmação de senha do usuário.
    """
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)

    first_name = None
    last_name = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'username']

    def __str__(self):
        """
        Retorna o e-mail do usuário como representação textual.
        
        Returns:
            str: E-mail do usuário.
        """
        return self.email


class Category(models.Model):
    """
    Representa uma categoria de transação financeira, associada a um usuário.
    
    Atributos:
        name (str): Nome da categoria.
        user (User): Usuário dono da categoria.
    """
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    color = models.CharField(max_length=7, default='#167ec5')

    def __str__(self):
        """
        Retorna o nome da categoria como representação textual.
        
        Returns:
            str: Nome da categoria.
        """
        return self.name


class Transaction(models.Model):
    """
    Representa uma transação financeira (receita ou despesa) vinculada a um usuário e categoria.
    
    Atributos:
        description (str): Descrição da transação.
        value (Decimal): Valor da transação.
        transaction_type (str): Tipo ('income' ou 'expense').
        date (date): Data da transação.
        category (Category): Categoria associada.
        user (User): Usuário dono da transação.
    """
    TRANSACTION_TYPES = (
        ('income', 'Receita'),
        ('expense', 'Despesa'),
    )

    description = models.CharField(max_length=200)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=7, choices=TRANSACTION_TYPES)
    date = models.DateField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='transactions')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')

    def __str__(self):
        """
        Retorna a descrição e valor da transação como representação textual.
        
        Returns:
            str: Descrição e valor da transação.
        """
        return f"{self.description} - {self.value}"
