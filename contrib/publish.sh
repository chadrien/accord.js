#!/usr/bin/env bash

# display commands and die on error
set -xe

if [ "$1" == "" ]; then
  set +xe
  >&2 echo "New version type was not given"
  >&2 echo "See \`npm help version\` for available options"
  exit 1
fi
versionType="$1" # major | minor | patch

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

# build the docs
npm run generate-docs
newVersion=$(npm version --no-git-tag-version $versionType)

# commit new docs and package version
git add .
git commit -m"Bump version $newVersion"

# build the new dist
npm run build

# move to a new branch and only keep the dist and package.json
git checkout --orphan $newVersion
git reset HEAD --
git add dist package.json
git clean -dxf

mv dist/* .
rm -rf dist node_modules

# commit and tag
git add .
git commit -m"Commit build for version $newVersion"
git tag $newVersion

# From here on, we only display helpful messages to the use, we don't need to see the commands anymore, they'll only be in the way
set +x

echo "Everything's done. You can check that things looks good and proceed with the release:"
echo "git push origin --tags"
echo "npm publish"
