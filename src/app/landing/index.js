'use strict';

const express = require('express');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const catchAll = require('./catchAll');
const existingDSI = require('./existingDSi');
const createAccount = require('./createAccount');

const router = express.Router();

const buildArea = () => {
  router.get('/existing-user', asyncWrapper(existingDSI.get));
  router.get('/create-account', asyncWrapper(createAccount.get));

  router.get('/', asyncWrapper(catchAll.get));

  router.get('/*', asyncWrapper((req, res) => {
    res.redirect(`/`);
  }));

  return router;
};

module.exports = buildArea;
