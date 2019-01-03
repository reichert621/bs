const request = require('superagent');
const CityMapper = require('./citymapper');

const API_BASE_URL =
  'https://us-central1-waybots-production.cloudfunctions.net';

const endpoints = {
  open: `${API_BASE_URL}/open`,
  marketForLocation: `${API_BASE_URL}/marketForLocation`,
  isUserRanger: `${API_BASE_URL}/isUserRanger`,
  batteryPercentagesForPins: `${API_BASE_URL}/batteryPercentagesForPins`
};

const open = () => {
  const endpoint = endpoints.open;
  const body = {
    // lat: 37.35789310972889,
    // lon: -122.09839200447448,
    // userId: [redacted]
  };

  return request
    .post(endpoint)
    .send(body)
    .then(res => res);
};

const marketForLocation = () => {
  const endpoint = endpoints.marketForLocation;
  const body = {
    // lat: 37.77243876753396,
    // lon: -122.41036743311585
  };

  return request
    .post(endpoint)
    .send(body)
    .then(res => res);
};

const isUserRanger = () => {
  const endpoint = endpoints.isUserRanger;
  const body = {
    // userId: [redacted]
  };

  return request
    .post(endpoint)
    .send(body)
    .then(res => res);
};

const batteryPercentagesForPins = (blackboxIds = []) => {
  const endpoint = endpoints.batteryPercentagesForPins;
  const body = {
    annotations: [
      ...blackboxIds.map(id => ({ blackboxId: id, lat: null, long: null }))
    ]
  };

  return request
    .post(endpoint)
    .send(body)
    .then(res => res.body);
};

const fetchScooters = async (query = {}) => {
  const scooters = await CityMapper.fetchSkipScooters(query);
  const blackboxIds = scooters.map(s => s.id);
  const charges = await batteryPercentagesForPins(blackboxIds);
  const chargesById = charges.reduce((acc, { blackboxId, battery }) => {
    return {
      ...acc,
      [blackboxId]: battery
    };
  });

  return scooters
    .filter(s => chargesById[s.id])
    .map(s => {
      return { ...s, charge: chargesById[s.id] };
    });
};

module.exports = {
  batteryPercentagesForPins,
  fetchScooters
};

/**
 * Notes
 */

// POST https://us-central1-waybots-production.cloudfunctions.net/open
// {
//   "lat": 37.35789310972889,
//   "lon": -122.09839200447448,
//   "userId": [redacted]
// }

// POST https://us-central1-waybots-production.cloudfunctions.net/marketForLocation
// {
//   "lat": 37.77243876753396,
//   "lon": -122.41036743311585
// }

// POST https://us-central1-waybots-production.cloudfunctions.net/isUserRanger
// {
//   "userId": [redacted]
// }

// POST https://us-central1-waybots-production.cloudfunctions.net/batteryPercentagesForPins
// {
//   "annotations": [
//     {
//       "blackboxId": "352897091321862",
//       "lat": 37.78106,
//       "long": -122.427935
//     }
//   ]
// }
