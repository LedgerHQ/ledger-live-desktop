#! /usr/local/bin/python3

import os
import json
from sys import argv
import sys
import re

folder1 = './src'
locales = './static/i18n/en/app.json'
files = []
rawkeys = {}
keys = {}
excludedKeys = [
    'errors',
    #Unsure of these really, to be checked by owners
    'cosmos.claimRewards.flow.steps',
]

rep = '\\1((\$\{[\.-\[\]\\\w]+\})|\\\w+)' #default pattern to match
dynamicKeys = {
    '^(addAccounts.sections.)\w+': rep,
    '^(banners.)\w+': rep,
    '^(bitcoin.pickingStrategyLabels.)\w+': rep,
    '^(byteSize.)\w+': rep,
    '^(DeviceAction.swap.)\w+': rep,
    '^(devices.)\w+': rep,
    '^(delegation.flow.steps.confirmation.success.)\w+': rep,
    '^(delegation.flow.steps.summary.)\w+': rep,
    '^(families.stellar.memoType.)\w+': rep,
    '^(fees.)\w+': rep,
    '^(freeze.steps.confirmation.success.)\w+': rep,
    '^(fullNode.modal.steps.satstack.connectionSteps.)[\w-]+': rep,
    '^(lend.account.)\w+': rep,
    '^(lend.enable.steps.)\w+': rep,
    '^(manager.modal.steps.)[\w-]+': rep,
    '^(migrateAccounts.progress.)[\w-]+': rep,
    '^(onboarding.alerts.)\w+': rep,
    '^(onboarding.pedagogy.screens.)\w+': rep,
    '^(onboarding.quizz.questions.)\w+': rep,
    '^(onboarding.screens.tutorial.screens.)\w+': rep,
    '^(onboarding.screens.tutorial.steps.)\w+': rep,
    '^(operation.type.)\w+': rep,
    '^(receive.steps.chooseAccount.)\w+': rep,
    '^(swap.form.)[\w-]+': rep,
    '^(swap.)\w+': rep,
    '^(time.range.)\w+': rep,
    '^(tokensList.)\w+': rep,
    '^(TransactionConfirm.recipientWording.)\w+': rep,
    '^(TransactionConfirm.titleWording.)\w+': rep,
}

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
            rawkeys[key] = 1

with open(locales) as f:
    data = json.load(f)
iterate(data,'')
print("Found "+str(len(rawkeys))+" literals")

##After we have the raw keys, process them to extract dynamic fields from them
##Attempt to match against _maybe_ dynamic keys but still allow for static ones,
##This should work for both "im.a.${dynamic}.key" and "im.a.static.key" without fail.
for rawkey, value in rawkeys.items(): #does it still need to be a dict?
    added = False
    for key, replacement in dynamicKeys.items():
        regexp = re.compile(key)
        if regexp.search(rawkey):
            newKey = re.sub(key, replacement, rawkey)
            keys[newKey] = 1
            added = True
            break
    if not added:
        keys[rawkey] = 1

counter = 0
for file in files:
    with open(file) as f:
        contents = f.read()
        counter += 1
        sys.stdout.write("\r"+str(counter)+"/"+str(len(files))+" files processed")
        for key, value in keys.items():
            if value == 0:
                continue
            regexp = re.compile(key)
            if regexp.search(contents):
                keys[key] = 0

all = [ bcolors.NOK+key+bcolors.ENDC for (key, value) in keys.items() if value == 1]

if len(all) == 0:
    print("\nAll literals were found in the components")
else:
    print("\nCouldn't find these literals:")
    print("\n".join(all))
