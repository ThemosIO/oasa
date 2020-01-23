import { useEffect, useState } from 'react';
import { GEO_OPTIONS, GEO_ERRORS } from '../config';

const useGeo = () => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const loading = !coords && !error;
  useEffect(() => {
    if((navigator || {}).geolocation) {
      const success = ({ coords: { latitude: lat, longitude: lon } }) => {
        setCoords([lat, lon]);
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
