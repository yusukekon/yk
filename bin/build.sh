#!/bin/sh -x

BASE_DIR=$(cd $(dirname $0); cd ..; pwd)

$BASE_DIR/bin/build-templates.py $BASE_DIR/js/templates/
r.js -o $BASE_DIR/build.js
