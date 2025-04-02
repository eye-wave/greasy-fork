#!/bin/bash

find . -type f -name 'package.json' -not -path '*node_modules*' | while read path
do
  cd $(dirname "$path")
  bun update
  cd -
done
