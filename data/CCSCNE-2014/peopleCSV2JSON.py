import csv
import json
infile = open("/Users/karl/Documents/CCSCNE2014People.csv")
reader = csv.reader(infile, delimiter=',', quotechar='"')
keys = next(reader) #skip the headers  
out = [{key: val for key, val in zip(keys, prop)} for prop in reader]
for item in out:
    item['name'] = [item['fname'],item['lname']]
    del item['fname']
    del item['lname']
    
    prog = []
    if item['prog1'] != "":
        prog.append(item['prog1'])
    if item['prog2'] != "":
        prog.append(item['prog2'])
    item['prog'] = prog
    del item['prog1']
    del item['prog2']

    item['tags'] = []

    links={}
    if item['linkstype1'] != "":
        links[item['linkstype1']]=item['links1']
    if item['linkstype2'] != "":
        links[item['linkstype2']]=item['links2']
    item['links'] = links
    del item['linkstype1']
    del item['links1']
    del item['linkstype2']
    del item['links2']


    #print(item)
    #print()
outfile = open("/Users/karl/git/konopas/data/people.js","w")
outfile.write("var people = ")
outfile.write(json.dumps(out))
outfile.close

