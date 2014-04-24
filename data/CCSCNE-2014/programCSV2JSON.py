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
infile = open("/Users/karl/Documents/CCSCNE2014Program.csv")
reader = csv.reader(infile, delimiter=',', quotechar='"')
keys = next(reader) #skip the headers  
out = [{key: val for key, val in zip(keys, prop)} for prop in reader]
for item in out:
    tags = []
    if item['tag1'] != "":
        tags.append(item['tag1'])
    if item['tag2'] != "":
        tags.append(item['tag2'])
    if item['tag3'] != "":
        tags.append(item['tag3'])
    item['tags'] = tags
    del item['tag1']
    del item['tag2']
    del item['tag3']

    people = []
    if item['pid1'] != "":
        dict = {}
        dict['id'] = item['pid1']
        dict['name'] = item['people1']
        people.append(dict)
    if item['pid2'] != "":
        dict = {}
        dict['id'] = item['pid2']
        dict['name'] = item['people2']
        people.append(dict)
    if item['pid3'] != "":
        dict = {}
        dict['id'] = item['pid3']
        dict['name'] = item['people3']
        people.append(dict)
    if item['pid4'] != "":
        dict = {}
        dict['id'] = item['pid4']
        dict['name'] = item['people4']
        people.append(dict)
    if item['pid5'] != "":
        dict = {}
        dict['id'] = item['pid5']
        dict['name'] = item['people5']
        people.append(dict)
    if item['pid6'] != "":
        dict = {}
        dict['id'] = item['pid6']
        dict['name'] = item['people6']
        people.append(dict)
    item['people'] = people
    del item['pid1']
    del item['pid2']
    del item['pid3']
    del item['pid4']
    del item['pid5']
    del item['pid6']
    del item['people1']
    del item['people2']
    del item['people3']
    del item['people4']
    del item['people5']
    del item['people6']

    item['loc'] = [item['loc']]

    #print(item)
    #print()
outfile = open("/Users/karl/git/konopas/data/program.js","w")
outfile.write("var program = ")
outfile.write(json.dumps(out))
outfile.close

