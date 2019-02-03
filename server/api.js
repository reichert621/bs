const express = require('express');
const Scoot = require('./scoot');
const Jump = require('./jump');
const GoBike = require('./gobike');
const Skip = require('./skip');
const { formatLocationResults } = require('./utils');

const { Router } = express;
const api = Router();

// For testing
api.get('/ping', (req, res) => res.json({ message: 'pong' }));

api.get('/scoot/all', (req, res) => {
  const { query } = req;

  return Scoot.fetchScooterInfo(query)
    .then(data => res.json({ data }))
    .catch(error => res.json({ error }));
});

api.get('/scoot/locations', (req, res) => {
  const { query } = req;

  return Scoot.fetchLocations(query)
    .then(data => res.json({ data }))
    .catch(error => res.json({ error }));
});

api.get('/scoot/scooters', (req, res) => {
  const { query } = req;

  return Scoot.fetchScooters(query)
    .then(data => res.json({ data }))
    .catch(error => res.json({ error }));
});

api.get('/scoot/kicks', (req, res) => {
  const { query } = req;

  return Scoot.fetchKicks(query)
    .then(data => res.json({ data }))
    .catch(error => res.json({ error }));
});

api.get('/jump/bikes', (req, res) => {
  const { query } = req;

  return Jump.fetchAvailableBikes(query)
    .then(data => res.json({ data }))
    .catch(error => res.json({ error }));
});

api.get('/go/bikes', (req, res) => {
  const { query } = req;

  return GoBike.fetchAvailableBikes(query)
    .then(data => res.json({ data }))
    .catch(error => res.json({ error }));
});

api.get('/skip/kicks', (req, res) => {
  const { query } = req;

  return Skip.fetchScooters(query)
    .then(data => res.json({ data }))
    .catch(error => res.json({ error }));
});

api.get('/vehicles', async (req, res) => {
  const { query } = req;

  return Promise.all([
    Scoot.fetchScooters(query),
    Scoot.fetchKicks(query),
    Jump.fetchAvailableBikes(query),
    GoBike.fetchAvailableBikes(query)
    // TODO: Skip is garbage, and Citymapper seems to have removed them
    // from their API... ping Max and ask about hitting Skip's API directly
    // Skip.fetchScooters(query)
  ])
    .then(response => {
      const { lat, lng } = query;
      const position = lat && lng ? { lat, lng } : null;
      const locations = formatLocationResults(response, position);

      return res.json({
        data: { locations }
      });
    })
    .catch(error => res.json({ error }));
});

module.exports = api;
