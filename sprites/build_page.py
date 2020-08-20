import sys

def main(argv):
    f = open("index.html", "w")
    startString = '''<!DOCTYPE html>
    <html>
    <head>
    <title>Sprites</title>
    </head>
    <body style="background-color:black;">
    '''
    f.write(startString)
    for arg in argv:
        if '.gif' in arg:
            string = '<img src=\"' + arg + '\" alt=\"' + arg + '\"\>'
            f.write(string)
            print(arg)
    for arg in argv:
        if '.png' in arg:
            string = '<img src=\"' + arg + '\" alt=\"' + arg + '\"\>'
            f.write(string)
            print(arg)
    endString = '''</body>
    </html>
    '''
    f.write(endString)


if __name__ == "__main__":
   main(sys.argv[1:])
