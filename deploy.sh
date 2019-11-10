#!/bin/bash
SOURCE_BRANCH="master"
TARGET_BRANCH="gh-pages"
DEPLOY_DIR="deploy"

echo "Deploy $SOURCE_BRANCH to $TARGET_BRANCH using tmp dir $DEPLOY_DIR"

git checkout master
SHA=`git rev-parse --verify HEAD`

if [ -d "$DEPLOY_DIR" ]; then
    echo "Remove old tmp folder: $DEPLOY_DIR"
    rm -rf $DEPLOY_DIR
fi

mkdir $DEPLOY_DIR
# Copy files to the temp folder
# Engine
cp engine.js $DEPLOY_DIR
# Indy
mkdir $DEPLOY_DIR/indy
mkdir $DEPLOY_DIR/indy/img
mkdir $DEPLOY_DIR/indy/snd
cp indy/index.html $DEPLOY_DIR/indy/index.html
cp indy/indy.js $DEPLOY_DIR/indy/indy.js
cp indy/indy.css $DEPLOY_DIR/indy/indy.css
cp indy/img/* $DEPLOY_DIR/indy/img
cp indy/snd/* $DEPLOY_DIR/indy/snd
# Prestavba
mkdir $DEPLOY_DIR/prestavba
mkdir $DEPLOY_DIR/prestavba/img
mkdir $DEPLOY_DIR/prestavba/snd
cp prestavba/index.html $DEPLOY_DIR/prestavba/index.html
cp prestavba/prestavba.js $DEPLOY_DIR/prestavba/prestavba.js
cp prestavba/prestavba.css $DEPLOY_DIR/prestavba/prestavba.css
cp prestavba/img/* $DEPLOY_DIR/prestavba/img
cp prestavba/snd/* $DEPLOY_DIR/prestavba/snd
# Listopad
mkdir $DEPLOY_DIR/listopad
mkdir $DEPLOY_DIR/listopad/img
mkdir $DEPLOY_DIR/listopad/snd
cp listopad/index.html $DEPLOY_DIR/listopad/index.html
cp listopad/listopad.js $DEPLOY_DIR/listopad/listopad.js
cp listopad/listopad.css $DEPLOY_DIR/listopad/listopad.css
cp listopad/img/* $DEPLOY_DIR/listopad/img
cp listopad/snd/* $DEPLOY_DIR/listopad/snd

git checkout gh-pages

rm -rf ./
cp -rf $DEPLOY_DIR/. ./

git add indy/*
git add prestavba/*
git add listopad/*

git commit -a -m "Deploy ${SHA}"
git push origin HEAD

echo "Removing tmp folder: $DEPLOY_DIR"
rm -rf $DEPLOY_DIR

git checkout master