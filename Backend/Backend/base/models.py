from django.db import models

# Create your models here.
class Item(models.Model):

    productName=models.CharField(max_length=200,default="mặc định")
    manufacturerID=models.CharField(max_length=20,default="0")
    typeID=models.CharField(max_length=20,default="0")
    wareHouseID=models.CharField(max_length=20,default="0")
    cost=models.DecimalField(max_digits=10,decimal_places=0,default='0.00')
    status=models.BooleanField(default=True)
    img=models.CharField(max_length=20000,default="no_images.img")
    productDesc=models.CharField(max_length=1000,default="mặc định")




