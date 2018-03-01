const express = require('express');
const _ = require('lodash');
// const tunnel = require('tunnel');
const HttpsProxyAgent = require('https-proxy-agent');
const utilities = require('./utilities');

const router = express.Router();

// const proxyTunnel = tunnel.httpsOverHttp({
//   proxy: {
//       host: 'http://proxy.gtm.lilly.com',
//       port: 9000,
//   },
// });

/* GET users listing. */
router.get('/', (req, res, next) => {
  
  const region = req.query.q;

  utilities.countriesList(region)
  .then((data)=>{
    let countries = [];
    data.forEach(element => {
      countries.push(element.name);
    });
    return res.send(JSON.stringify(countries));
  })
  .catch((error)=>{
    error.status = 400;
    // return res.render('index');
    return res.render('error', {
      message: 'Bad Request',
      status: error.status,
    });
  })
  //
});


router.get('/:region/sort', (req,res,next) => {
  const region = req.params.region;
  utilities.countriesList(region)
  .then((data)=>{
    let countries = [];
    data.forEach(element => {
      countries.push(element.name);
    });
    let promiseArray = [];

    countries.forEach(country => {
      promiseArray.push(utilities.countryDetails(country));
    });

    Promise.all(promiseArray)
    .then((resultArray)=>{
      let populationArray = [];
      resultArray.forEach(element => {
        populationArray.push({
          name: element.name,
          population: element.population
        });
      });
      populationArray = _.sortBy(populationArray, 'population');
      return res.send(JSON.stringify(populationArray));
    });
  })
  .catch((error)=>{
    error.status = 400;
    // return res.render('index');
    return res.render('error', {
      message: 'Bad Request',
      status: error.status,
    });
  })
})

module.exports = router;
