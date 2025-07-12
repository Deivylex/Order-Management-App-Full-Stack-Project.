const appRoutes = require('express').Router()
const axios = require('axios')
const logger = require('../utils/logger')

appRoutes.get('/', async(req, res) => {
    try {
        const response = await axios.get('https://opensky-network.org/api/states/all?lamin=59.7&lomin=20.5&lamax=70.1&lomax=31.6')
        const data = response.data.states
        
        if (!data || data.length === 0) {
            return res.json({
                success: true,
                message: "No flights found in the specified region",
                total: 0,
                flights: []
            });
        }

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
        
    } catch (error) {
        logger.error('Error fetching flight data:', error.message);
        res.status(500).json({
            success: false,
            message: "Error retrieving flight data",
            error: error.message
        });
    }
})

module.exports = appRoutes