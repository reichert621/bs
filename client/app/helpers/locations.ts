import * as moment from 'moment';
import * as qs from 'query-string';
import * as request from 'superagent';
import { groupBy, keys } from 'lodash';

// TODO: is there a better name for this?
export type Location = {
  lat: number;
  lng: number;
  id?: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  color?: IconColor;
  company?: string;
  type?: VehicleType;
  size?: IconSize;
  class?: LocationKind;
  distance?: number;
  miles?: number;
  rank?: number;
  charge?: number;
  isNearby?: boolean;
};

// TODO: figure out the best way to distinguish between vehicles and stations
export type Vehicle = Location & {};

export type Station = Location & {
  available?: {
    bikes: number;
    ebikes: number;
    returning: number;
  };
};

export type LocationKind = 'vehicle' | 'station';

export type VehicleType = 'bike' | 'scooter' | 'kick';

export type SortDirection = 'asc' | 'desc';

export enum IconSize {
  SM,
  MD,
  LG
}

export enum IconColor {
  BLUE = 'blue',
  GRAY = 'gray',
  BLACK = 'black',
  RED = 'red'
}

export type IconOptions = {
  size?: IconSize;
  color?: IconColor;
  type?: VehicleType;
};

const views: { [key: string]: Location } = {
  home: { lat: 37.767043, lng: -122.426436 }, // Dolores & Hidalgo
  work: { lat: 37.772977, lng: -122.40067 } // Stripe office
};

export const getDefaultLocation = (query = ''): Location => {
  const { view, lat, lng } = qs.parse(query);

  if (lat && lng) {
    return { lat: Number(lat), lng: Number(lng) };
  } else {
    const coordinates = views[view as string];

    return coordinates || views.home;
  }
};

export const calculateMidpoint = (p1: Location, p2: Location) => {
  return {
    lat: (p1.lat + p2.lat) / 2,
    lng: (p1.lng + p2.lng) / 2
  };
};

export const findClosestVehicles = (locations: Location[]): Location[] => {
  return locations
    .filter(location => location.miles < 0.3)
    .sort((a, b) => a.miles - b.miles);
};

export const findBestOptions = (locations: Location[], n = 2) => {
  return findClosestVehicles(locations)
    .filter(l => {
      if (l.class === 'station') {
        return true;
      }

      return l.charge && l.charge > 20;
    })
    .slice(0, n);
};

export const findClosestByCompany = (locations: Location[]): Location[] => {
  const grouped = groupBy(locations, l => `${l.company}_${l.type}`);

  return keys(grouped)
    .reduce((acc, key) => {
      const options = grouped[key];

      return acc.concat(findBestOptions(options));
    }, [])
    .sort((a, b) => {
      if (a.rank === b.rank) {
        return a.miles - b.miles;
      } else {
        return a.rank - b.rank;
      }
    });
};

export const fetchVehicleLocations = (
  query: any
): Promise<{ locations: Location[] }> => {
  const stringifed = qs.stringify(query);

  return request.get(`/api/vehicles?${stringifed}`).then(res => res.body.data);
};

export const fetchScootKicks = (): Promise<any> => {
  return request.get(`/api/scoot/kicks`).then(res => res.body.data);
};

export const fetchSkipKicks = (): Promise<any> => {
  return request.get(`/api/skip/kicks`).then(res => res.body.data);
};

export const fetchScootScooters = (): Promise<any> => {
  return request.get(`/api/scoot/scooters`).then(res => res.body.data);
};

export const fetchJumpBikes = (): Promise<any> => {
  return request.get(`/api/jump/bikes`).then(res => res.body.data);
};

export const fetchGoBikes = (): Promise<any> => {
  return request.get(`/api/go/bikes`).then(res => res.body.data);
};
