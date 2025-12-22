from django.urls import path
from . import views

urlpatterns=[
    path('',views.getData),
    path('add/',views.addItem),
    path('update/<int:pk>/', views.updateItem),
    path("chat/",views.chatbot_recommend,name='chat_recommend')
]