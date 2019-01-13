
docker run -d --rm --name logs-text1 -e NAME=TEST1 -v "$PWD":/usr/src/app -w /usr/src/app node:alpine node text.js
docker run -d --rm --name logs-text2 -e NAME=TEST2 -v "$PWD":/usr/src/app -w /usr/src/app node:alpine node text.js
