from django.conf.urls import url
from . import views

app_name='calculator'

urlpatterns = [
	url(r'^saveData$',views.saveData,name='saveData'),
	url(r'^getopenid$',views.getOpenid,name='getOpenid'),
	url(r'^getData$',views.getData,name='getData'),
]
