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

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await axios.get('http://localhost:3001');
        setFlights(res.data.flights);
      } catch (err) {
        console.error('Failed to fetch flights:', (err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
    const interval = setInterval(fetchFlights, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-center mt-4">Loading flights...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Live Flights over Venezuela</h2>
      {flights.length === 0 ? (
        <p className="text-gray-600">No flights detected at this moment.</p>
      ) : (
        <ul className="space-y-4">
          {flights.map((f) => (
            <li key={f.id} className="p-4 border border-gray-300 rounded-xl shadow-sm bg-white">
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
  );
};

export default FlightList;
