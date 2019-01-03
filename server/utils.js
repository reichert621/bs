const { flatten } = require('lodash');

const getLocationCharge = charge => {
  if (!charge) return null;

  const num = Number(charge.replace('%', '').trim());

  return num <= 0 || num > 100 ? null : num;
};

// Borrowed from https://www.geodatasource.com/developers/javascript
const calculateDistanceInMiles = (p1, p2) => {
  const { lat: lat1, lng: lng1 } = p1;
  const { lat: lat2, lng: lng2 } = p2;

  if (lat1 === lat2 && lng1 === lng2) {
    return 0;
  } else {
    const radLat1 = (Math.PI * lat1) / 180;
    const radLat2 = (Math.PI * lat2) / 180;
    const theta = lng1 - lng2;
    const radTheta = (Math.PI * theta) / 180;
    const sines = Math.sin(radLat1) * Math.sin(radLat2);
    const cosines = Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);

    let dist = sines + cosines;

    if (dist > 1) {
      dist = 1;
    }

    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;

    return dist;
  }
};

const formatLocationResults = (locations, position) => {
  return flatten(locations)
    .map(l => {
      const miles = position ? calculateDistanceInMiles(l, position) : null;

      return { ...l, miles, isNearby: miles ? miles < 0.3 : false };
    })
    .sort((a, b) => {
      const m1 = a.miles * 100;
      const m2 = b.miles * 100;

      if (m1 === m2) {
        return b.charge - a.charge;
      } else {
        return m1 - m2;
      }
    });
};

module.exports = {
  getLocationCharge,
  calculateDistanceInMiles,
  formatLocationResults
};
