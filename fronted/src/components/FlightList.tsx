import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Flight = {
  id: number;
  callsign: string;
  country: string;
  longitude: number | null;
  latitude: number | null;
  altitude: number | null;
  velocity: number | null;
};

const FlightList: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Europe/Helsinki'
      });
      setCurrentTime(timeString);
    };

    updateTime();

    const fetchFlights = async () => {
      try {
        const res = await axios.get('http://localhost:3000');
        setFlights(res.data.flights);
      } catch (err) {
        console.error('Failed to fetch flights:', (err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-center text-white text-xl font-bold bg-black bg-opacity-50 p-4 rounded">Loading flights...</p>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="p-6 max-w-3xl mx-auto">
        <div className="mb-4 bg-white bg-opacity-80 p-4 rounded-xl">
          <h2 className="text-2xl font-bold">Live Flights over Finland</h2>
          <p className="text-sm text-gray-600 mt-1">{currentTime}</p>
        </div>
        {flights.length === 0 ? (
          <p className="text-gray-800 bg-white bg-opacity-80 p-4 rounded-xl">No flights detected at this moment.</p>
        ) : (
          <ul className="space-y-4">
            {flights.map((f) => (
              <li key={f.id} className="p-4 border border-gray-300 rounded-xl shadow-sm bg-white bg-opacity-90">
                <div className="text-lg font-semibold">✈️ {f.callsign}</div>
                <div className="text-sm text-gray-500">{f.country}</div>
                <div className="mt-2 text-sm">
                  <p>📍 Lat: {f.latitude} | Lon: {f.longitude}</p>
                  <p>📏 Altitude: {f.altitude} m</p>
                  <p>💨 Speed: {f.velocity} m/s</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FlightList;
