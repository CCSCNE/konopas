# Copyright (C) 2014 Karl R. Wurst
# 
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 3 of the License, or
# (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
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

