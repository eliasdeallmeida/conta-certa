from rest_framework import generics, permissions, viewsets
from .serializers import UserSerializer, CategorySerializer, TransactionSerializer
from .models import User, Category, Transaction


class CreateUserView(generics.CreateAPIView):
    """
    Endpoint para cadastro de novos usuários.
    
    Métodos HTTP:
        POST: Cria um novo usuário.
    
    Parâmetros:
        request (Request): Dados do usuário.
    Returns:
        Response: Usuário criado ou erros de validação.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class CategoryViewSet(viewsets.ModelViewSet):
    """
    Endpoint para CRUD de categorias do usuário autenticado.
    
    Métodos HTTP:
        GET: Lista categorias do usuário.
        POST: Cria nova categoria.
        PUT/PATCH: Atualiza categoria.
        DELETE: Remove categoria.
    
    Parâmetros:
        request (Request): Dados da categoria.
    Returns:
        Response: Categoria(s) ou erros de validação.
    """
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Retorna apenas as categorias do usuário autenticado.
        
        Returns:
            QuerySet: Categorias do usuário.
        """
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Salva a categoria associando ao usuário autenticado.
        
        Parâmetros:
            serializer (CategorySerializer): Serializer da categoria.
        """
        serializer.save(user=self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
    """
    Endpoint para CRUD de transações do usuário autenticado.
    
    Métodos HTTP:
        GET: Lista transações do usuário.
        POST: Cria nova transação.
        PUT/PATCH: Atualiza transação.
        DELETE: Remove transação.
    
    Parâmetros:
        request (Request): Dados da transação.
    Returns:
        Response: Transação(ões) ou erros de validação.
    """
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Retorna apenas as transações do usuário autenticado.
        
        Returns:
            QuerySet: Transações do usuário.
        """
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Salva a transação associando ao usuário autenticado.
        
        Parâmetros:
            serializer (TransactionSerializer): Serializer da transação.
        """
        serializer.save(user=self.request.user)
