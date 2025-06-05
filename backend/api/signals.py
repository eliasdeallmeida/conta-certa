from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User


def notify_user_created(user):
    """
    Notifica (via print) quando um novo usuário é criado.
    
    Parâmetros:
        user (User): Instância do usuário criado.
    """
    print(f'Usuário criado: {user.email}')


@receiver(post_save, sender=User)
def user_created_signal(sender, instance, created, **kwargs):
    """
    Signal Observer: executa notify_user_created ao criar um novo usuário.
    
    Parâmetros:
        sender (Model): Classe do modelo que enviou o signal.
        instance (User): Instância criada.
        created (bool): Indica se foi criado.
        **kwargs: Argumentos adicionais.
    """
    if created:
        notify_user_created(instance)
