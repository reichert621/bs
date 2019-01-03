const request = require('superagent');

const DEFAULT_LOCATION = '37.767043,-122.426436'; // Mission Dolores
const API_BASE_URL = 'https://us-sf-api.citymapper.com';
const endpoints = {
  everything: `${API_BASE_URL}/1/everythinglive`,
  nearby: `${API_BASE_URL}/3/nearby`
};
/**
 * Query param options:
 * sw:   37.77391,-122.43153
 * ne:   37.77391,-122.41651
 * zoom: 14.98
 * @param {object} query
 */
const fetchEverythingLive = (query = {}) => {
  const q = {
    sw: '37.76145,-122.43225',
    ne: '37.78514,-122.41317',
    zoom: 14.63,
    ...query
  };

  return request
    .get(endpoints.everything)
    .query(q)
    .then(res => res.body);
};

/**
 * Query param options:
 * viewspan:  0.000001,0.015016
 * brand_ids: Bird,LimeScooter,ScootKick,Skip
 * extended:  1
 * mode_id:   us-sf-kickscooter
 * limit:     100
 * location:  37.773908,-122.424017
 * @param {object} query
 */
const fetchNearbyVehicles = (query = {}) => {
  const q = {
    viewspan: '0.000001,0.015016', // TODO: figure out what this means
    brand_ids: 'Bird,LimeScooter,ScootKick,Skip',
    extended: 1,
    mode_id: 'us-sf-kickscooter',
    limit: 1000,
    location: DEFAULT_LOCATION,
    ...query
  };

  return request
    .get(endpoints.nearby)
    .query(q)
    .then(res => res.body);
};

const formatSkipVehicle = data => {
  const { id: cityMapperId, coords = [] } = data;
  const [n, id] = cityMapperId.split('_');
  const name = 'scooter';
  const [lat, lng] = coords;

  return {
    id,
    name,
    lat,
    lng,
    latitude: lat,
    longitude: lng,
    type: 'kick',
    class: 'vehicle',
    company: 'skip',
    rank: 2,
    meta: data
  };
};

const fetchSkipScooters = (query = {}) => {
  const { lat, lng } = query;
  const location = lat && lng ? `${lat},${lng}` : '37.767043,-122.426436';

  const q = {
    location,
    viewspan: '0.000001,0.015016',
    brand_ids: 'Skip',
    ...query
  };

  return fetchNearbyVehicles(q)
    .then(res => res.elements)
    .then(vehicles => vehicles.map(v => formatSkipVehicle(v)));
};

module.exports = {
  fetchSkipScooters
};
