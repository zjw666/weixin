from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse
from .models import User,Record

import urllib,json

def getData(request):
	openid = request.GET.get('openid')
	nickname = request.GET.get('nickname')
	user = User.objects.filter(openid = openid)[0]
	data = []
	if user:
		if not user.nickname:
			user.nickname = nickname
			user.save()
		expressions = Record.objects.filter(user=user).order_by('-time')[0:3]
		if expressions:
			for value in expressions:
				data.append(value.expression)
	data = json.dumps(data)
	return HttpResponse(data)

def saveData(request):
	openid = request.GET.get('openid')
	expression = request.GET.get('save_data')
	user = User.objects.filter(openid = openid)[0]
	if user and expression:
		record = Record(expression=expression,user=user)
		record.save()
		return HttpResponse('ok')
	return HttpResponse('error')
		

	
def getOpenid(request):
	code = request.GET.get('code')
	url = 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code' % (settings.APPID,settings.APPSECRET,code)
	response = urllib.request.urlopen(url)
	result = json.loads(response.read().decode('utf-8'))
	openid = result['openid']
	if openid:
		users = User.objects.filter(openid=openid)
		if not users:
			user = User(openid=openid)
			user.save()
	else:
		openid = 'none'
	return HttpResponse(openid)
	
