#!/usr/bin/env python

import sys
from os.path import *
from glob import glob

OUT_FILENAME = 'templates.js'

if len(sys.argv) < 2:
    print 'usage: ./build-templates.py path/to/tpl/dir'
    sys.exit(0)

path = abspath(sys.argv[1])
if not exists(path):
    print 'no such directory: {0}'.format(path)
    sys.exit(1)

target = join(path, '*.tpl');

out = open(abspath(join(path, '..', OUT_FILENAME)), 'wb')
out.write("define(['yk'], function() {\n")
out.write("yk.package('yk.templates');\n")
for tpl in glob(target):
    name = basename(tpl).split('.')[0]
    lines = []
    with open(tpl) as f:
        for line in f.readlines():
            lines.append(line.rstrip('\n').strip(' '))
    out.write('yk.templates.' + name + "='" + ''.join(lines) + "'\n")
out.write("});")
out.flush()
