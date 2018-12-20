'use strict';

const express = require('express');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const catchAll = require('./catchAll');
const existingDSI = require('./existingDSi');
const existingSA = require('./existingSA');
const newUser = require('./newUser');
const router = express.Router();

const buildArea = () => {
  router.get('/existing-user', asyncWrapper(existingDSI.get));
  router.get('/existing-secure-access-user', asyncWrapper(existingSA.get));
  router.get('/new-user', asyncWrapper(newUser.get));
  router.get('/*', asyncWrapper(catchAll.get));
  return router;
};

module.exports = buildArea;
