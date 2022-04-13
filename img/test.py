import PIL
import os
import os.path
from PIL import Image


f = "/Users/jamescarthew/Documents/GitHub/royalchant.github.io/img/covers"

for file in os.listdir(f):
    f_img = f+"/"+file
    img = Image.open(f_img)
    img = img.resize((500,500))
    img.save(f_img)
