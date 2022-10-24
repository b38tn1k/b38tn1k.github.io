# USe this to make smol initially
import string
# filename = 'smangled.js'
filename = 'smolled.js'

if __name__ == '__main__':
    with open(filename, 'r') as f:
            translator = str.maketrans(string.punctuation, ' '*len(string.punctuation)) #map punctuation to space
            # my_list = re.split('[ ,\.;=*+-]',(f.readline()))
            my_list = f.readline().translate(translator).split()
            my_dict = {}
            for word in my_list:
                if word in my_dict:
                    my_dict[word] += 1
                else:
                    my_dict[word] = 1
            sorted_dict = sorted(my_dict.items(), key=lambda x:x[1]*len(x[0]))
            size = 0
            for item in sorted_dict:
                size += item[1] * len(item[0])
                print(item[0], item[1] * len(item[0]))
            print (size/1000)
