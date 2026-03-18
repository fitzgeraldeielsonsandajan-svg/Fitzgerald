from rest_framework.routers import DefaultRouter
from notepad.views import NoteViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'notes', NoteViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = router.urls