const { getAllServices } = require('./../../infrastructure/applications');
const uniqBy = require('lodash/uniqBy');
const sortBy = require('lodash/sortBy');

const getAndMapExternalServices = async (correlationId) => {
  const allServices = await getAllServices(correlationId) || [];
  const services = uniqBy(allServices.services.map((service) => ({
    id: service.id,
    name: service.name,
    isExternalService: service.isExternalService,
  })), 'id');
  return sortBy(services, 'name');
};

const get = async (req, res) => {
  const services = await getAndMapExternalServices(req.id);

  return res.render('landing/views/catchAll', {
    services,
  });
};

module.exports = {
  get,
};
