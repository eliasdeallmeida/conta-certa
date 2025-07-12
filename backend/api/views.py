from collections import defaultdict
from rest_framework import generics, permissions, viewsets, filters
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .serializers import UserSerializer, CategorySerializer, TransactionSerializer
from .models import User, Category, Transaction
from .utils import normalizar


REGRAS_FIXAS = {
    "Alimentação": ["mercado", "comida", "restaurante", "supermercado", "lanche", "almoço", "jantar", "café"],
    "Transporte": ["uber", "gasolina", "ônibus", "metrô", "99", "moto", "bicicleta"],
    "Saúde": ["farmácia", "remédio", "médico", "hospital", "dentista"],
    "Roupas": ["roupa", "vestido", "calça", "camiseta", "camisa", "saia", "calção", "bermuda", "short",  "cueca", "calcinha", "sutiã", "roupa íntima"],
    "Calçados": ["sapato", "tênis", "sandália", "chinelo", "bota", "botas", "sneaker", "tenis", "tenis de corrida", "tenis de caminhada", "tenis de corrida", "tenis de caminhada"],
    "Lazer": ["cinema", "teatro", "show", "stand up"],
    "Casa": ["aluguel", "condomínio", "água", "luz", "internet"],
    "Outros": ["presente", "presente para alguém", "presente para mim", "presente para alguém", "presente para mim"],
}


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


def sugestao_por_regras(descricao):
    descricao = normalizar(descricao)
    correspondencias = []
    for categoria, palavras in REGRAS_FIXAS.items():
        for palavra in palavras:
            if normalizar(palavra) in descricao:
                correspondencias.append(categoria)
                break
    return correspondencias[:3]


def sugestao_por_similaridade(descricao, transacoes):
    descricoes = [normalizar(t.description) for t in transacoes]
    descricao_normalizada = normalizar(descricao)
    categorias = [t.category.name for t in transacoes]

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(descricoes + [descricao_normalizada])
    similaridades = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])[0]

    categoria_scores = defaultdict(float)
    for i, score in enumerate(similaridades):
        cat = categorias[i]
        if score > categoria_scores[cat]:
            categoria_scores[cat] = score

    sugestoes_ordenadas = sorted(categoria_scores.items(), key=lambda x: x[1], reverse=True)
    return [cat for cat, _ in sugestoes_ordenadas[:3]]


@api_view(['GET'])
def sugerir_categorias(request):
    user = request.user
    descricao = request.GET.get('q', '').strip().lower()

    if not descricao:
        return Response([])

    transacoes_usuario = Transaction.objects.filter(user=user).exclude(category=None)

    if transacoes_usuario.count() < 10:
        regras = sugestao_por_regras(descricao)
        similares = sugestao_por_similaridade(descricao, transacoes_usuario)
        # Prioriza categorias que aparecem em ambos
        ranking = []

        # 1. Categorias que aparecem nas duas listas (mais relevantes)
        for cat in similares:
            if cat in regras and cat not in ranking:
                ranking.append(cat)

        # 2. Depois as mais parecidas (do histórico)
        for cat in similares:
            if cat not in ranking:
                ranking.append(cat)

        # 3. Por fim, as que vieram só das regras
        for cat in regras:
            if cat not in ranking:
                ranking.append(cat)

        # Retorna top 3
        return Response(ranking[:3])
    else:
        similares = sugestao_por_similaridade(descricao, transacoes_usuario)
        return Response(similares)
