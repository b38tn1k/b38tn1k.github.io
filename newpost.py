import os
import sys
from datetime import date

def main(args):
    global html
    today = str(date.today())
    title = args[0]
    project_name = today + '-' + title + '.markdown'
    print(project_name)
    f = open('_posts/' + project_name, 'w')
    f.write('---')
    f.write('\n')
    f.write('layout: post')
    f.write('\n')
    f.write('title: ' + title)
    f.write('\n')
    f.write('date: ' + today)
    f.write('\n')
    f.write('categories: []')
    f.write('\n')
    f.write('tags: ')
    f.write('\n')
    f.write('---')
    f.write('\n')
    f.close()

if __name__ == "__main__":
   main(sys.argv[1:])
