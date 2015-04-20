#!/bin/bash

PLUGIN_DIR=$HOME/.vimperator/plugin

if [[ ! -d $PLUGIN_DIR ]]; then
  echo "creating $PLUGIN_DIR"
  mkdir -p $PLUGIN_DIR
fi

echo "making sym-link into $PLUGIN_DIR"
ln -fs $(pwd)/*.js $PLUGIN_DIR

if which ghq >/dev/null; then
  repo=$(ghq list -p vimpr/vimperator-plugins)
  if [[ -n $repo ]]; then
    echo "making sym-link of _libly.js into $PLUGIN_DIR"
    ln -fs $repo/_libly.js $PLUGIN_DIR
  fi
fi
