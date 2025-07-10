const appRoutes = require('express').Router()
const axios = require('axios')
const logger = require('../utils/logger')

appRoutes.get('/', async(req, res) => {

    const response = await axios.get('https://opensky-network.org/api/states/all?lamin=0.6&lomin=-73.4&lamax=12.5&lomax=-59.8')
    const data = response.data.states
    //logger.info(response.data.states)
    const flights = data.map((f, i) => {
        const callsign = f[1]?.trim() || 'N/A';
        const country = f[2] || 'N/A';
        const longitude = f[5] || null;
        const latitude = f[6] || null;
        const altitude = f[7] || null;
        const velocity = f[9] || null;

        logger.info(`${i + 1}. Callsign: ${callsign} | country: ${country}`);
        
        return {
            id: i + 1,
            callsign: callsign,
            country: country,
            longitude: longitude,
            latitude: latitude,
            altitude: altitude,
            velocity: velocity
        };
    })
    res.json({
        success: true,
        message: "Flight data retrieved successfully",
        total: flights.length,
        flights: flights
    });
})

module.exports = appRoutes