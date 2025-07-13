from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, TransactionViewSet, sugerir_categorias, transaction_summary


router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = [
    path("transactions/summary/", transaction_summary),
    path('categorias/sugestoes/', sugerir_categorias),
    path('', include(router.urls)),
]
