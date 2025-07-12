from rest_framework import generics, permissions, viewsets, filters
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
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


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


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
    pagination_class = StandardResultsSetPagination

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
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['description']
    ordering_fields = ['date', 'value']

    def get_queryset(self):
        """
        Retorna apenas as transações do usuário autenticado.
        
        Returns:
            QuerySet: Transações do usuário.
        """
        queryset = Transaction.objects.filter(user=self.request.user)
        # Filtros customizados
        tipo = self.request.query_params.get('tipo')
        categoria = self.request.query_params.get('categoria')
        data = self.request.query_params.get('data')
        if tipo:
            queryset = queryset.filter(transaction_type=tipo)
        if categoria:
            queryset = queryset.filter(category__id=categoria)
        if data:
            queryset = queryset.filter(date=data)
        return queryset

    def perform_create(self, serializer):
        """
        Salva a transação associando ao usuário autenticado.
        
        Parâmetros:
            serializer (TransactionSerializer): Serializer da transação.
        """
        serializer.save(user=self.request.user)

@api_view(['GET'])
def sugerir_categorias(request):
    query = request.GET.get('q', '').lower()
    if not query:
        return Response([])

    transacoes = Transaction.objects.exclude(category=None)
    descricoes = [t.description.lower() for t in transacoes]
    categorias = [t.category.name for t in transacoes]

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(descricoes + [query])
    
    similaridades = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])[0]
    
    top_indices = similaridades.argsort()[::-1][:5]
    sugestoes = list({categorias[i] for i in top_indices})

    return Response(sugestoes)
