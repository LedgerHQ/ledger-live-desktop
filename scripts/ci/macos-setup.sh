#!/bin/bash

sudo rm -rf /usr/local/lib/node_modules
sudo rm /usr/local/bin/node
cd  /usr/local/bin && ls -l | grep "../lib/node_modules/" | awk '{print $9}'| xargs rm

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
echo "unset PREFIX" >> ~/.bashrc
source ~/.bashrc
nvm install 8.11.3
node --version
