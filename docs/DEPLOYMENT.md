# Deployment Guide

## Local run

1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Run `npm start` or `node server.js`.
4. Open `http://localhost:3000`.

## Pre-deployment checks

Run `node --test` and confirm that all API regression tests pass. Open the Admin > System Status page and verify that historical-data validation is complete.

## Production notes

Set the `PORT` environment variable when hosting. The current server uses the seeded marketplace data in `mockdata.js`; replace this data layer with a persistent database before production use. Keep the API and static UI behind HTTPS.
