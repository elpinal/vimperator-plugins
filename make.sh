#!/bin/bash

PLUGIN_DIR=$HOME/.vimperator/plugin

if [[ ! -d $PLUGIN_DIR ]]; then
  echo "creating $PLUGIN_DIR"
  mkdir -p $PLUGIN_DIR
fi

echo "making sym-link into $PLUGIN_DIR"
ln -s $(pwd)/*.js $PLUGIN_DIR/
