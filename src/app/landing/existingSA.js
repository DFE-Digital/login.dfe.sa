'use strict';
const { getAllServices } = require('./../../infrastructure/applications');
const uniqBy = require('lodash/uniqBy');
const sortBy = require('lodash/sortBy');

const getAndMapExternalServices = async (correlationId) => {
  const allServices = await getAllServices(correlationId) || [];
  const services = uniqBy(allServices.services.map((service) => ({
    id: service.id,
    name: service.name,
    serviceUrl: (service.relyingParty ? (service.relyingParty.service_home || service.relyingParty.redirect_uris[0]): undefined) || '#',
    isExternalService: service.isExternalService,
    isMigrated: service.isMigrated,

  })), 'id');
  return sortBy(services, 'name');
};

const get = async (req, res) => {
  const services = await getAndMapExternalServices(req.id);
  return res.render('landing/views/existingSA', {
    services
  });
};

module.exports = {
  get,
};
