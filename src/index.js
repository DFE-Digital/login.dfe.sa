const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const logger = require('./infrastructure/logger');
const https = require('https');
const http = require('http');
const path = require('path');
const config = require('./infrastructure/config');
const helmet = require('helmet');
const sanitization = require('login.dfe.sanitization');
const healthCheck = require('login.dfe.healthcheck');
const registerRoutes = require('./routes');
const { getErrorHandler } = require('login.dfe.express-error-handling');

https.globalAgent.maxSockets = http.globalAgent.maxSockets =
  config.hostingEnvironment.agentKeepAlive.maxSockets || 50;

const app = express();
app.use(
  helmet({
    noCache: true,
    frameguard: {
      action: 'deny'
    }
  })
);

if (config.hostingEnvironment.env !== 'dev') {
  app.set('trust proxy', 1);
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(sanitization());
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'app'));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

app.use(
  '/healthcheck',
  healthCheck({
    config
  })
);

let assetsUrl =
  config.hostingEnvironment.assetsUrl ||
  'https://rawgit.com/DFE-Digital/dfe.ui.toolkit/master/dist/';
assetsUrl = assetsUrl.endsWith('/')
  ? assetsUrl.substr(0, assetsUrl.length - 1)
  : assetsUrl;
Object.assign(app.locals, {
  urls: {
    help: config.hostingEnvironment.helpUrl,
    interactions: config.hostingEnvironment.interactionsUrl,
    services: config.hostingEnvironment.servicesUrl,
    assets: assetsUrl,
    survey: config.hostingEnvironment.surveyUrl
  },
  app: {
    environmentBannerMessage: config.hostingEnvironment.environmentBannerMessage
  },
  gaTrackingId: config.hostingEnvironment.gaTrackingId
});
registerRoutes(app);

// Error handing
app.use(
  getErrorHandler({
    logger
  })
);

if (config.hostingEnvironment.env === 'dev') {
  app.proxy = true;

  const options = {
    key: config.hostingEnvironment.sslKey,
    cert: config.hostingEnvironment.sslCert,
    requestCert: false,
    rejectUnauthorized: false
  };
  const server = https.createServer(options, app);

  server.listen(config.hostingEnvironment.port, () => {
    logger.info(
      `Dev server listening on https://${config.hostingEnvironment.host}:${
        config.hostingEnvironment.port
      } with config:\n${JSON.stringify(config)}`
    );
  });
} else {
  app.listen(process.env.PORT, () => {
    logger.info(
      `Server listening on http://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}`
    );
  });
}
