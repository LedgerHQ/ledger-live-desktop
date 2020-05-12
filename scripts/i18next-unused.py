#! /usr/local/bin/python3

import os
import json
from sys import argv

hideFound = len(argv)>1


folder1 = './src'
locales = './static/i18n/en/app.json'
files = []
keys = {}
excludedKeys = [
    'fees.',
    'errors.',
    'operation.type.',
    'time.range.',
    'delegation.flow.steps.',
    'settings.profile.developerMode',
    'manager.modal.steps.',
    'TransactionConfirm.recipientWording.',
    'migrateAccounts.progress.',
    'addAccounts.sections.',
    'accounts.order.'
]

class bcolors:
    OK = '\033[92m'
    NOK = '\033[91m'
    ENDC = '\033[0m'

##Ugly way of listing all components
def recursive_walk(folder):
    for folderName, subfolders, filenames in os.walk(folder):
        if subfolders:
            for subfolder in subfolders:
                recursive_walk(subfolder)
        for filename in filenames:
            if filename.endswith(".js"):
                files.append(os.path.join(folderName, filename))

recursive_walk(folder1)

##Ugly way of getting all literals
def iterate(obj, stack):
    for attr, value in obj.items():
        key = stack+"."+attr
        if any(item.startswith(key) or key.startswith(item) for item in excludedKeys):
            continue
        if key.endswith("_plural"):
            continue
        if type(value) is dict:
            if len(stack):
                iterate(value, key)
            else:
                iterate(value, attr)
        else:
            keys[key] = 1

with open(locales) as f:
    data = json.load(f)
iterate(data,'')


##Now we have all the components and literals listed, look for matches, as soon
## as we find a match, remove it from the dict to make this less horrible.

for file in files:
    with open(file) as f:
        contents = f.read()
        for key, value in keys.items():
            if value == 0:
                continue
            if key in contents:
                keys[key] = 0

all = []
if not hideFound:
    all = [ ((bcolors.OK, bcolors.NOK)[value==1])+key+bcolors.ENDC for (key, value) in keys.items() ]
else:
    all = [ bcolors.NOK+key+bcolors.ENDC for (key, value) in keys.items() if value == 1]

notFound = [ 1 for (key, value) in keys.items() if value == 1]

print("===============================================")
print("List of literals:")
print("===============================================")
print("\n".join(all))
print("===============================================")
print("Total of "+str(len(notFound))+" not found")
print("===============================================")
