const request = require('superagent');
const { getLocationCharge } = require('./utils');

// NB: see https://sf.jumpbikes.com/opendata/gbfs.json for more info
const API_BASE_URL = 'http://sf.jumpbikes.com/opendata';
const endpoints = {
  bikes: `${API_BASE_URL}/free_bike_status.json`
};

const format = bike => {
  const {
    name,
    lat,
    bike_id: bikeId,
    lon: lng,
    jump_ebike_battery_level: battery,
    jump_vehicle_type: type
  } = bike;
  const id = `jump_${bikeId}`;
  const charge = getLocationCharge(battery);

  return {
    id,
    name,
    charge,
    type,
    lat,
    lng,
    latitude: lat,
    longitude: lng,
    class: 'vehicle',
    company: 'jump',
    rank: 1,
    meta: bike
  };
};

const fetchAvailableBikes = (query = {}) => {
  return request
    .get(endpoints.bikes)
    .query(query)
    .then(res => res.body.data)
    .then(({ bikes }) => {
      return bikes
        .filter(bike => {
          const { is_reserved: isReserved, is_disabled: isDisabled } = bike;

          return !isReserved && !isDisabled;
        })
        .map(bike => format(bike));
    });
};

// TODO: compare with above (may not distinguish available/reserved bikes?)
const fetchBikesDirect = () => {
  return request
    .get('https://app.jumpbikes.com/api/networks/155/bikes')
    .query({ per_page: 999 })
    .set({
      Referer: 'https://map.jump.com/'
    })
    .then(res => res.body);
};

module.exports = {
  fetchAvailableBikes
};
