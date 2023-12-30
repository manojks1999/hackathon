#!/bin/bash
#download node and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 14.17.1
npm i -g npm@7.24.2
npm i -g pm2

#create our working directory if it doesnt exist
DIR="/home/app-master"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} directory"
  sudo mkdir ${DIR}
fi