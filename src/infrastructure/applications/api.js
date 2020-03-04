const config = require('./../config');
const rp = require('login.dfe.request-promise-retry');
const jwtStrategy = require('login.dfe.jwt-strategies');

const getPageOfService = async (pageNumber, pageSize) => {
  const token = await jwtStrategy(config.applications.service).getBearerToken();
  try {
    const client = await rp({
      method: 'GET',
      uri: `${config.applications.service.url}/services?page=${pageNumber}&pageSize=${pageSize}`,
      headers: {
        authorization: `bearer ${token}`
      },
      json: true
    });
    return client;
  } catch (e) {
    if (e.statusCode === 404) {
      return undefined;
    }
    throw e;
  }
};

const getAllServices = async () => {
  const services = [];

  let pageNumber = 1;
  let numberOfPages = undefined;
  while (numberOfPages === undefined || pageNumber <= numberOfPages) {
    const page = await getPageOfService(pageNumber, 50);

    services.push(...page.services);

    numberOfPages = page.numberOfPages;
    pageNumber += 1;
  }

  return { services };
};

module.exports = {
  getAllServices
};
