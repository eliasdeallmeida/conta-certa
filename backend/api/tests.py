from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Category, Transaction
from .serializers import UserSerializer, CategorySerializer, TransactionSerializer
from datetime import date, timedelta


class UserSerializerTest(TestCase):
    def test_password_confirmation(self):
        data = {
            'name': 'Teste',
            'username': 'testeuser',
            'email': 'teste@email.com',
            'password': '123456',
            'confirm_password': '654321',
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('confirm_password', serializer.errors)


class CategorySerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='cat@email.com', username='catuser', name='Cat', password='123456')

    def test_unique_category_name_per_user(self):
        Category.objects.create(name='Alimentação', user=self.user)
        data = {'name': 'Alimentação', 'user': self.user.id}
        context = {'request': type('obj', (object,), {'user': self.user})()}
        serializer = CategorySerializer(data=data, context=context)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)


class TransactionSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='trans@email.com', username='transuser', name='Trans', password='123456')
        self.category = Category.objects.create(name='Salário', user=self.user)

    def test_value_positive(self):
        data = {
            'description': 'Teste',
            'value': -10,
            'transaction_type': 'income',
            'date': date.today(),
            'category': self.category.id,
        }
        context = {'request': type('obj', (object,), {'user': self.user})()}
        serializer = TransactionSerializer(data=data, context=context)
        self.assertFalse(serializer.is_valid())
        self.assertIn('value', serializer.errors)

    def test_date_not_future(self):
        data = {
            'description': 'Teste',
            'value': 100,
            'transaction_type': 'income',
            'date': date.today() + timedelta(days=1),
            'category': self.category.id,
        }
        context = {'request': type('obj', (object,), {'user': self.user})()}
        serializer = TransactionSerializer(data=data, context=context)
        self.assertFalse(serializer.is_valid())
        self.assertIn('date', serializer.errors)


class APITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='api@email.com', username='apiuser', name='API', password='123456')

    def test_register_user(self):
        url = reverse('register')
        data = {
            'name': 'Novo',
            'username': 'novouser',
            'email': 'novo@email.com',
            'password': '123456',
            'confirm_password': '123456',
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_authenticate_user(self):
        url = reverse('get_token')
        data = {'email': 'api@email.com', 'password': '123456'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_category_crud(self):
        # Autentica
        token = self.client.post(reverse('get_token'), {'email': 'api@email.com', 'password': '123456'}).data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

        # Cria categoria
        response = self.client.post('/api/categories/', {'name': 'TestCat'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Lista categorias
        response = self.client.get('/api/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Atualiza categoria
        cat_id = response.data[0]['id']
        response = self.client.put(f'/api/categories/{cat_id}/', {'name': 'CatEdit'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Deleta categoria
        response = self.client.delete(f'/api/categories/{cat_id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_transaction_crud(self):
        # Autentica
        token = self.client.post(reverse('get_token'), {'email': 'api@email.com', 'password': '123456'}).data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        
        # Cria categoria
        cat = self.client.post('/api/categories/', {'name': 'TransCat'}).data
        
        # Cria transação
        data = {
            'description': 'Salário',
            'value': 1000,
            'transaction_type': 'income',
            'date': str(date.today()),
            'category': cat['id'],
        }
        response = self.client.post('/api/transactions/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Lista transações
        response = self.client.get('/api/transactions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Atualiza transação
        trans_id = response.data[0]['id']
        data['value'] = 2000
        response = self.client.put(f'/api/transactions/{trans_id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Deleta transação
        response = self.client.delete(f'/api/transactions/{trans_id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
