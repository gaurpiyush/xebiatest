const fs = require('fs');
const HttpsProxyAgent = require('https-proxy-agent');
const axios = require('axios');
const regionUrl = 'https://restcountries.eu/rest/v2/region/';
const detailsUrl = 'https://restcountries.eu/rest/v2/name/';

exports.createProxyAgent = function createProxyAgent() {
  let proxyAgent;
  // HTTP/HTTPS proxy to connect to
  if (process.env.NODE_ENV === 'local') {
    const proxy = process.env.HTTP_PROXY;
    // create an instance of the `HttpsProxyAgent` class with the proxy server information
    proxyAgent = new HttpsProxyAgent(proxy);
  }
  return proxyAgent;
};

exports.precompileHandlebar = function precompileHandlebar(data, filepath) {
  const templateScript = fs.readFileSync(filepath, 'utf-8');
  const template = global.handlebars.compile(templateScript);
  const html = template(data);
  return html.trim();
};

exports.countriesList = (region) => {
  const requestBody = {
    method: 'GET',
    url: `${regionUrl}${region}`,
    // httpAgent: utilities.createProxyAgent(),

  };
  return axios(requestBody);
}

exports.countryDetails = (name) => {
  const requestBody = {
    method: 'GET',
    url: `${detailsUrl}${name}`,
    // httpAgent: utilities.createProxyAgent(),

  };
  return axios(requestBody);
}