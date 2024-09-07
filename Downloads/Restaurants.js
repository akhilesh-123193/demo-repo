import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import maplibregl from 'maplibre-gl'; // Use maplibre-gl for MapTiler
import 'maplibre-gl/dist/maplibre-gl.css';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapContainer = useRuseEffect(() => {
    if (mapContainer.current) {
      const map = maplibregl.getMap(mapContainer.current);
      const restaurantLayer = {
        id: 'restaurants',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: restaurants.map((restaurant) => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [restaurant.longitude, restaurant.latitude],
              },
              properties: {
                name: restaurant.name,
              },
            })),
          },
        },
        layout: {
          'icon-image': 'restaurant-icon', // replace with your icon image
          'icon-size': 0.05,
        },
      };
      map.addLayer(restaurantLayer);
    }
  }, [restaurants]);ef(null);

  const latitude = 37.7749; // Replace with dynamic latitude
  const longitude = -122.4194; // Replace with dynamic longitude
  const OSM_NOMINATIM_URL = `https://nominatim.openstreetmap.org/search?`;
  const OSM_NOMINATIM_QUERY = `q=restaurant&format=json&limit=10&addressdetails=1&bbox=${longitude-0.1},${latitude-0.1},${longitude+0.1},${latitude+0.1}`;

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${OSM_NOMINATIM_URL}${OSM_NOMINATIM_QUERY}`);
        console.log(response.data); // Log data to inspect structure
        setRestaurants(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err); // Log error for debugging
        setError(err);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [latitude, longitude]);

  useEffect(() => {
    if (mapContainer.current && restaurants.length > 0) {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://maps.tilehosting.com/styles/positron/style.json?key=EIhSH3UkZEiWAdBabgXK', // Replace with your MapTiler style URL
        center: [longitude, latitude],
        zoom: 14,
      });

      // Add markers for restaurants
      restaurants.forEach(restaurant => {
        if (restaurant.lon && restaurant.lat) {
          new maplibregl.Marker()
            .setLngLat([restaurant.lon, restaurant.lat])
            .setPopup(new maplibregl.Popup().setText(restaurant.display_name || restaurant.address))
            .addTo(map);
        }
      });
    }
  }, [restaurants, latitude, longitude]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <div>
      <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />
      <h2>Restaurants Page</h2>
      <ul>
        {restaurants.map((restaurant, index) => (
          <li key={index}>
            <h3>{restaurant.display_name || restaurant.address}</h3>
            <p>{restaurant.address || 'No address available'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Restaurants;



