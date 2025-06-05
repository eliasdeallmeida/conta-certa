# Conta Certa - Backend

## Visão Geral

Este é o back-end do sistema **Conta Certa**, uma API REST para gestão financeira pessoal, desenvolvida em Django REST Framework.

## Tecnologias Utilizadas
- Python
- Django REST Framework
- JWT Authentication
- PostgreSQL

## Instalação

1. Clone o repositório e acesse a pasta `backend`:
   ```bash
   cd backend
   ```
2. Crie e ative um ambiente virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate    # Windows
   ```
3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
4. Realize as migrações:
   ```bash
   python manage.py migrate
   ```
5. Execute o servidor de desenvolvimento:
   ```bash
   python manage.py runserver
   ```

## Endpoints Principais

- `POST /api/user/register/` — Cadastro de usuário
- `POST /api/token/` — Autenticação (JWT)
- `POST /api/token/refresh/` — Refresh do token JWT
- `GET/POST/PUT/DELETE /api/categories/` — Gerenciamento de categorias (autenticado)
- `GET/POST/PUT/DELETE /api/transactions/` — Gerenciamento de transações (autenticado)

## Modelos

### User
- `name`: Nome do usuário
- `email`: E-mail (único, usado para login)
- `username`: Nome de usuário (obrigatório)
- `password`: Senha

### Category
- `name`: Nome da categoria (único por usuário)
- `user`: Usuário dono da categoria

### Transaction
- `description`: Descrição
- `value`: Valor (positivo)
- `transaction_type`: Tipo ("income" ou "expense")
- `date`: Data (não pode ser futura)
- `category`: Categoria (deve pertencer ao usuário)
- `user`: Usuário dono da transação

## Validações e Regras de Negócio
- Senhas devem coincidir no cadastro de usuário.
- Nome da categoria deve ser único por usuário.
- Valor da transação deve ser positivo.
- Categoria da transação deve pertencer ao usuário autenticado.
- Data da transação não pode ser futura.

## Padrões de Projeto GoF Utilizados
- **Observer:** Utilizado via signals do Django para notificar quando um usuário é criado (`api/signals.py`).

---

Dúvidas ou sugestões? Abra uma issue ou entre em contato.