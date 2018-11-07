from django.apps import AppConfig


class APIConfig(AppConfig):
    name = 'api'

    def ready(self):
        from paypal.standard.ipn.signals import valid_ipn_received
        from .views.PayPalView import confirm

        valid_ipn_received.connect(confirm)
