import os
import sys

html = '''
<!DOCTYPE html>
<html lang="" xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="http://ogp.me/ns/fb#">
  <head>
    <meta name="viewport" content="user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width">
    <meta charset="utf-8">
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://b38tn1k.com/inv.png" />
    <meta property="og:url" content="https://b38tn1k.com/namenamenamename/" />
    <meta property="og:title" content="namenamenamename" />
    <meta property="og:description" content="namenamenamename" />
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1.0"> -->
    <title>namenamenamename</title>
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <style> body {padding: 0; margin: 0;} </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/p5.js"></script>
    <script src="source.js"></script>

     <meta name="description" content="namenamenamename">
     <style>
     body {
       padding: 0;
       margin: 0;
       user-select: none;
       background-color: #373a62;
     }
     a:link {
      color: white;
      background-color: transparent;
      text-decoration: none;
    }

    a:visited {
      color: white;
      background-color: transparent;
      text-decoration: none;
    }

    a:hover {
      color: white;
      background-color: transparent;
      text-decoration: underline;
    }

    a:active {
      color: white;
      background-color: transparent;
      text-decoration: underline;
    }
   </style>
  </head>

  <body scroll="no" style="overflow: hidden">
    <main>
    </main>
  </body>

</html>
'''

js = '''
var widthOnTwo, heightOnTwo;

function keyPressed() {
  if (key == ' ') {
    console.log('bang');
  }
  if (keyCode == DOWN_ARROW){

  return;
  }  else if (keyCode == LEFT_ARROW){

  return;
  }  else if (keyCode == UP_ARROW){

  return;
  }  else if (keyCode == RIGHT_ARROW){

  return;
  }
}

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function mousePressed() {
  console.log(mouseX, mouseY)

}

function setupScreen() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  widthOnTwo = windowWidth / 2;
  heightOnTwo = windowHeight / 2;
}

function setup() {

  setupScreen();
}

function draw() {

}
'''

def main(args):
    global html
    project_name = args[0]
    print(project_name)
    os.system('mkdir ' + project_name)
    os.system('cd ' + project_name)
    html = html.replace('namenamenamename', project_name)
    f = open(project_name + '/index.html', 'w')
    f.write(html)
    f.close()
    f = open(project_name + '/source.js', 'w')
    f.write(js)
    f.close()
    print('ppp -m http.server 4000')

if __name__ == "__main__":
   main(sys.argv[1:])
