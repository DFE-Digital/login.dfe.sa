const landing = require('./app/landing');

const registerRoutes = (app) => {
  app.use('/', landing());
};

module.exports = registerRoutes;