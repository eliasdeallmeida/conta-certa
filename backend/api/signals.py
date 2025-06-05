from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User


def notify_user_created(user):
    print(f'Usuário criado: {user.email}')


@receiver(post_save, sender=User)
def user_created_signal(sender, instance, created, **kwargs):
    if created:
        notify_user_created(instance)
