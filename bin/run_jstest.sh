#!/bin/sh -x

BASE_DIR=$(cd $(dirname $0); cd ..; pwd)
QUNIT_HOME=$BASE_DIR/3rd-party/qunit/
PHANTOMJS_HOME=$BASE_DIR/3rd-party/phantomjs-1.8.1/

$PHANTOMJS_HOME/bin/phantomjs -v
#$PHANTOMJS_HOME/bin/phantomjs $PHANTOMJS_HOME/examples/run-qunit.js $@
$PHANTOMJS_HOME/bin/phantomjs $QUNIT_HOME/addons/phantomjs/runner.js $@
