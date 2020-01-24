import { useEffect, useState } from 'react';

const GEO_ERRORS = { UNSUPPORTED: 'unsupported', FAILED: 'failed' };

const useGeo = () => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const loading = !coords && !error;
  useEffect(() => {
    if((navigator || {}).geolocation) {
      const success = ({ coords: { latitude: lat, longitude: lon } }) => {
        setCoords([
          parseFloat(parseFloat(lat).toFixed(4)),
          parseFloat(parseFloat(lon).toFixed(4)),
        ]);
        setError(null);
      };
      const error = () => setError(GEO_ERRORS.FAILED);
      navigator.geolocation.watchPosition(success, error);
      const watch = navigator.geolocation.watchPosition(success, error);
      return () => navigator.geolocation.clearWatch(watch);
    } else {
      setError(GEO_ERRORS.UNSUPPORTED);
    }
  }, [error]);

  return [coords, error, loading];
};

export default useGeo;
