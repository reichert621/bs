const request = require('superagent');
const { groupBy } = require('lodash');

const API_BASE_URL = 'https://app.scoot.co/api';
const types = { SCOOTER: 'scooter', KICK: 'kick' };
const endpoints = {
  scooters: `${API_BASE_URL}/v1/scooters`,
  locations: `${API_BASE_URL}/v3/locations`
};
/**
 * Query param options:
 * - `accuracy`: 48.00724964208526
 * - `gps_fix_time`: 1545854182481.3188
 * - `latitude`: 37.357838355156616
 * - `locations_updated_since`: 1545854173
 * - `longitude`: -122.0984892559274
 * - `updated_since`: 1545854173
 */
const fetchScooterInfo = (query = {}) => {
  return request
    .get(endpoints.scooters)
    .query(query)
    .then(res => res.body);
};

const fetchLocations = (query = {}) => {
  return request
    .get(endpoints.locations)
    .query(query)
    .then(res => res.body);
};

const format = vehicle => {
  const {
    latitude,
    longitude,
    id: scootId,
    public_name: publicId,
    batt_pct_smoothed: charge,
    vehicle_type: { vehicle_class: type }
  } = vehicle;
  const id = `scoot_${scootId}`;
  const name = String(publicId);
  const lat = Number(latitude);
  const lng = Number(longitude);

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
    company: 'scoot',
    rank: type === types.KICK ? 2 : 4,
    meta: vehicle
  };
};

const getVehicleType = scooter => {
  const { vehicle_type: vtype } = scooter;
  const { vehicle_class: type } = vtype;

  return type;
};

const isVehicleType = (scooter, type) => {
  return getVehicleType(scooter) === type;
};

const fetchByType = (type, query = {}) => {
  return fetchScooterInfo(query)
    .then(r => r.scooters)
    .then(scooters => {
      return scooters
        .filter(scooter => isVehicleType(scooter, type))
        .map(scooter => format(scooter, type));
    });
};

const groupByType = scooters => {
  return groupBy(
    scooters.map(scooter => format(scooter)),
    scooter => scooter.type
  );
};

const fetchGroupedByType = (query = {}) => {
  return fetchScooterInfo(query)
    .then(r => r.scooters)
    .then(scooters => groupByType(scooters));
};

const fetchScooters = (query = {}) => {
  return fetchByType(types.SCOOTER, query);
};

const fetchKicks = (query = {}) => {
  return fetchByType(types.KICK, query);
};

module.exports = {
  fetchScooterInfo,
  fetchLocations,
  fetchScooters,
  fetchKicks,
  fetchGroupedByType
};
