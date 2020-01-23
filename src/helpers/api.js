import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // proxied through netlify.toml
  timeout: 5000,
  headers: { 'Access-Control-Allow-Origin': '*' },
});

export const GET_CLOSEST_STOPS = ({ lat, lon }) => lat && lon &&
  api.get(`/?act=getClosestStops&p1=${lat}&p2=${lon}`);

export const GET_STOP_ARRIVALS = stopCode => stopCode &&
  api.get(`/?act=getStopArrivals&p1=${stopCode}`);

export const GET_ROUTES_FOR_STOP = stopCode => stopCode &&
  api.get(`/?act=webRoutesForStop&p1=${stopCode}`);

// export const GET_LINES = () => api.get('/?act=webGetLines');
