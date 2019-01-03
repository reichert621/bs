const request = require('superagent');

// NB: see https://gbfs.fordgobike.com/gbfs/gbfs.json for more info
const API_BASE_URL = 'https://gbfs.fordgobike.com/gbfs/en';
const endpoints = {
  status: `${API_BASE_URL}/station_status.json`,
  info: `${API_BASE_URL}/station_information.json`
};

const fetchStationStatus = (query = {}) => {
  const endpoint = endpoints.status;

  return request
    .get(endpoint)
    .query(query)
    .then(res => res.body.data);
};

const fetchStationInfo = (query = {}) => {
  const endpoint = endpoints.info;

  return request
    .get(endpoint)
    .query(query)
    .then(res => res.body.data);
};

const format = station => {
  const {
    name,
    lat,
    lon: lng,
    station_id: stationId,
    num_bikes_available: bikes,
    num_ebikes_available: ebikes,
    is_returning: returning
  } = station;
  const id = `gobike_${stationId}`;

  return {
    id,
    name,
    lat,
    lng,
    latitude: lat,
    longitude: lng,
    class: 'station',
    type: 'bike',
    company: 'gobike',
    rank: 3,
    available: { bikes, ebikes, returning },
    meta: station
  };
};

const fetchAvailableBikes = async (query = {}) => {
  const statuses = await fetchStationStatus(query).then(r => r.stations);
  const infos = await fetchStationInfo(query).then(r => r.stations);
  const mappings = statuses.concat(infos).reduce((acc, station) => {
    const { station_id: id } = station;

    return {
      ...acc,
      [id]: {
        ...(acc[id] || {}),
        ...station
      }
    };
  }, {});

  return Object.values(mappings)
    .filter(station => {
      const {
        num_bikes_available: bikes,
        num_ebikes_available: ebikes
      } = station;

      return bikes + ebikes > 0;
    })
    .map(station => format(station));
};

module.exports = {
  fetchStationStatus,
  fetchStationInfo,
  fetchAvailableBikes
};
