from django.db import models

class User(models.Model):
	openid = models.CharField(max_length=20)
	nickname = models.CharField(max_length=20,null=True)
	def __str__(self):
		return self.nickname

class Record(models.Model):
	expression = models.CharField(max_length=100)
	user = models.ForeignKey(User)
	time = models.DateTimeField(auto_now_add=True)
	
