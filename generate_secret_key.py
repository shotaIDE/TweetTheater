from django.core.management.utils import get_random_secret_key


secret_key = get_random_secret_key()

print('Add the following secret key definition to your .env file.')
print(f"DJANGO_SECRET_KEY='{secret_key}'")
