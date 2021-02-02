#! /usr/local/bin/python3

import os
import json
import re
import requests

from sys import argv

print("List of urls with errors")

excludedURLs = [
    'https://twitter.com/Ledger',
    'https://www.reddit.com/r/ledgerwallet/',
]

with open("./src/config/urls.js") as f:
    urls = re.findall(r"\"(.+)\"", f.read())
    for url in urls:
        if url not in excludedURLs:
            c = requests.get(url)
            if (int(c.status_code) > 200):
                print(c.status_code,":",url)

