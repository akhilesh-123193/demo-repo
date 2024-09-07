import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapContainer = useRef(null);

  // Dynamic latitude and longitude
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);

  const OSM_NOMINATIM_URL = `https://nominatim.openstreetmap.org/search?`;
  const OSM_NOMINATIM_QUERY = `q=hotel&format=json&limit=10&addressdetails=1&bbox=${longitude-0.1},${latitude-0.1},${longitude+0.1},${latitude+0.1}`;

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get(`${OSM_NOMINATIM_URL}${OSM_NOMINATIM_QUERY}`);
        setHotels(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchHotels();
  }, [latitude, longitude]);

  useEffect(() => {
    if (mapContainer.current && hotels.length > 0) {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://maps.tilehosting.com/styles/positron/style.json?key=EIhSH3UkZEiWAdBabgXK', // Replace with your MapTiler style URL
        center: [longitude, latitude],
        zoom: 14,
      });

      // Add markers for hotels
      hotels.forEach(hotel => {
        if (hotel.lon && hotel.lat) {
          const marker = new maplibregl.Marker({
            color: '#FF0000', // Set the color of the marker icon
          })
            .setLngLat([hotel.lon, hotel.lat])
            .addTo(map);

          // Add an icon to the marker
          const icon = new maplibregl.Marker({
            color: '#FF0000', // Set the color of the icon
          }).setIcon(document.createElement('div'));
          marker.setIcon(icon);
        }
      });
    }
  }, [hotels, mapContainer]);

  return (
    <div>
      <div ref={mapContainer} style={{ width: '100%', height: '600px' }} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {hotels.map(hotel => (
            <li key={hotel.osm_id}>
              <h2>{hotel.display_name}</h2>
              <p>Lat: {hotel.lat}, Lon: {hotel.lon}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Hotels;