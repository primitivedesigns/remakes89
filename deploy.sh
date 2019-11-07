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
mkdir $DEPLOY_DIR/indy/snd
mkdir $DEPLOY_DIR/indy/img
cp indy/indy.js $DEPLOY_DIR/indy
cp indy/index.html $DEPLOY_DIR/indy
cp indy/indy.css $DEPLOY_DIR/indy
cp indy/img/title.png $DEPLOY_DIR/indy/img
cp indy/snd/beep.wav $DEPLOY_DIR/indy/snd
# Prestavba
mkdir $DEPLOY_DIR/prestavba
mkdir $DEPLOY_DIR/prestavba/snd
mkdir $DEPLOY_DIR/prestavba/img
cp prestavba/prestavba.js $DEPLOY_DIR/prestavba
cp prestavba/index.html $DEPLOY_DIR/prestavba
cp prestavba/prestavba.css $DEPLOY_DIR/prestavba
cp prestavba/img/title.png $DEPLOY_DIR/prestavba/img
cp prestavba/snd/beep.wav $DEPLOY_DIR/prestavba/snd
# Listopad
mkdir $DEPLOY_DIR/listopad
mkdir $DEPLOY_DIR/listopad/snd
mkdir $DEPLOY_DIR/listopad/img
cp listopad/listopad.js $DEPLOY_DIR/listopad
cp listopad/index.html $DEPLOY_DIR/listopad
cp listopad/listopad.css $DEPLOY_DIR/listopad
# TODO img and snd

git checkout gh-pages

cp -rf $DEPLOY_DIR/. ./

git add indy/*
git add prestavba/*
git add listopad/*

git commit -a -m "Deploy ${SHA}"
git push origin HEAD

echo "Removing tmp folder: $DEPLOY_DIR"
rm -rf $DEPLOY_DIR

git checkout master
