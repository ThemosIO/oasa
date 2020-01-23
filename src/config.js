export const API = 'http://telematics.oasa.gr/api/';
export const GET_CLOSEST_STOPS = ({ lat, lon }) => `${API}?act=getClosestStops&p1=${lat}&p2=${lon}`;
export const GEO_OPTIONS = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };
export const GEO_ERRORS = { UNSUPPORTED: 'unsupported', FAILED: 'failed' };
