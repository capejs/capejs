set -x
set -e
echo prefix=~/.node >> ~/.npmrc
npm install -g bower gulp
bower install
gulp
