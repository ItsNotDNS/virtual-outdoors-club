from django.core.management.base import BaseCommand, CommandError
from background_task.models import Task
from ...tasks import worker


class Command(BaseCommand):
    help = "Creates the worker task in the database"

    def add_arguments(self, parser):
        parser.add_argument('--demo', action='store_true', dest='demo', help='Creates a demo worker')
        parser.add_argument('--wipe', action='store_true', dest='wipe', help='Removes already created workers')

    def handle(self, *args, **options):
        if options['wipe']:
            Task.objects.all().delete()

        if not Task.objects.exists():
            if options['demo']:
                worker(repeat=60, repeat_until=None)
            else:
                worker(repeat=Task.DAILY, repeat_until=None)
            self.stdout.write(self.style.SUCCESS("Worker successfully created"))
            return

        raise CommandError("Worker already created. Please remove the current worker or re-run commond with --wipe")
