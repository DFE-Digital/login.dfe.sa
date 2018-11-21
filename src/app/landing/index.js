'use strict';

const express = require('express');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const catchAll = require('./catchAll');

const router = express.Router();

const buildArea = () => {
  router.get('/*', asyncWrapper(catchAll.get));

  return router;
};

module.exports = buildArea;