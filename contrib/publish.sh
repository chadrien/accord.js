#!/usr/bin/env bash

# display commands and die on error
set -xe

# make sure the working copy is clean
if [ "$(git status --short | wc -l)" -ne "0" ]; then
  set +xe
  >&2 echo "You have pending changes in your working copy"
  >&2 git status --short
  exit 1
fi

# removes node_modules and such to ensure a clean working copy
git clean -dxf

# install fresh dependencies and run test
npm install
npm test

# build the new dist
npm run build

# make sure something changed
if [ "$(git status --short dist | wc -l)" -eq "0" ]; then
  set +xe
  >&2 echo "Nothing new to publish, the dist remained the same"
  git checkout docs # the docs would have change because of a link to a specific commit hash that can safelly be ignored
  exit 1
fi

git add .
git commit -m'Commit new build'
