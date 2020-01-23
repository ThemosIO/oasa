import { useEffect, useState } from 'react';

const GEO_ERRORS = { UNSUPPORTED: 'unsupported', FAILED: 'failed' };
const GEO_OPTIONS = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

const useGeo = () => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const loading = !coords && !error;
  useEffect(() => {
    if((navigator || {}).geolocation) {
      const success = ({ coords: { latitude: lat, longitude: lon } }) => {
        setCoords([
          parseFloat(parseFloat(lat).toFixed(5)),
          parseFloat(parseFloat(lon).toFixed(5)),
        ]);
        setError(null);
      };
      const error = () => setError(GEO_ERRORS.FAILED);
      navigator.geolocation.watchPosition(success, error);
      const watch = navigator.geolocation.watchPosition(success, error, GEO_OPTIONS);
      return () => navigator.geolocation.clearWatch(watch);
    } else {
      setError(GEO_ERRORS.UNSUPPORTED);
    }
  }, []);

  return [coords, error, loading];
};

export default useGeo;
