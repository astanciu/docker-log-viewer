docker run -d --rm --name logs-text -e NAME=TEST1 -v "$PWD":/usr/src/app -w /usr/src/app node:alpine node text.js
