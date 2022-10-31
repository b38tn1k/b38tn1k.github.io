with open('source.txt') as f:
    txt = f.read()
    words = txt.split(' ')
    myDict = {}
    for word in words:
        if (word.lower()) in myDict:
            myDict[word.lower()]+=1
        else:
            myDict[word.lower()] = 1
    my_string = "[\""
    for key in myDict:
        if myDict[key] < 2:
            my_string += key + "\", \""
    my_string += "];"
    print(my_string)
