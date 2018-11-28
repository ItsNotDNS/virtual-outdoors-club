from django.core.management.base import BaseCommand, CommandError
from background_task.models import Task
from ...tasks import *


class Command(BaseCommand):
    help = "Creates the worker tasks in the database"

    def add_arguments(self, parser):
        parser.add_argument('--demo', action='store_true', dest='demo', help='Creates demo workers')
        parser.add_argument('--wipe', action='store_true', dest='wipe', help='Removes already created workers')
        parser.add_argument('--disableEmail', action='store_false', dest='email', help='Does not create email worker')
        parser.add_argument('--disableStats', action='store_false', dest='stats', help='Does not create statistics worker')

    def handle(self, *args, **options):
        if options['wipe']:
            Task.objects.all().delete()

        if not Task.objects.exists():
            dur = Task.DAILY
            if options['demo']:
                dur = 60

            if options['email']:
                email_worker(repeat=dur, repeat_until=None)

            if options['stats']:
                stats_worker(repeat=dur, repeat_until=None)

            self.stdout.write(self.style.SUCCESS("Worker successfully created"))
            return

        raise CommandError("Worker already created. Please remove the current worker or re-run commond with --wipe")
