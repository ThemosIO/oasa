import axios from 'axios';
import {
  getStoredRoutes,
  getStoredStops,
  updateStoredRoutes,
  updateStoredStops,
} from './localStorage';
// import data from './stopData';

const obj = {};
const arr = [];
const func = () => {};

const api = axios.create({
  baseURL: '/api', // proxied through netlify.toml
  timeout: 4000,
  headers: { 'Access-Control-Allow-Origin': '*' },
});

const API_GET_CLOSEST_STOPS = (coords = arr) => coords.length === 2 && // lat lon
  api.get(`/?act=getClosestStops&p1=${coords[0]}&p2=${coords[1]}`);

const API_GET_STOP_ARRIVALS = stopCode => stopCode &&
  api.get(`/?act=getStopArrivals&p1=${stopCode}`);

const API_GET_ROUTES_FOR_STOP = stopCode => stopCode &&
  api.get(`/?act=webRoutesForStop&p1=${stopCode}`);

export const GET_STOPS = async (
  coords = arr, // lat lon
  successCallback = func,
  errorCallback = func,
) => {
  if(coords.length !== 2) return;
  errorCallback(null);
  try {
    const { data } = await API_GET_CLOSEST_STOPS(coords);
    const curatedData = (data || arr)
      .filter(stop => stop.StopLat != null && stop.StopLng != null) // == used for null/undefined
      .map(stop => ({
        coords: [
          parseFloat(parseFloat(stop.StopLat).toFixed(5)),
          parseFloat(parseFloat(stop.StopLng).toFixed(5)),
        ],
        id: stop.StopCode,
        title: stop.StopDescr || stop.StopDescrEng || '',
        street: (parseInt(stop.StopHeading, 10) > 0 ? `${stop.StopHeading} ` : '')
          + (stop.StopStreet || stop.StopStreetEng || ''),
      }));
    if(curatedData.length > 0) {
      updateStoredStops(curatedData);
      successCallback(getStoredStops());
    }
  } catch(err) {
    errorCallback(((err || obj).response || obj).status || 404);
  }
};

export const GET_ARRIVALS = async (
  stopCode,
  successCallback = func,
  errorCallback = func,
  timestampCallback = func,
) => {
  console.log('getArrivals()');
  errorCallback(null);
  try {
    const { data } = await API_GET_STOP_ARRIVALS(stopCode);
    const curatedData = (data || arr)
      .filter(arrival => arrival.route_code != null && arrival.btime2 != null)
      .map(arrival => ({
        route: arrival.route_code,
        minutes: arrival.btime2,
      }));
    if(curatedData.length > 0) {
      timestampCallback(new Date().toLocaleTimeString());
      successCallback(curatedData);
    }
  } catch(err) {
    errorCallback(((err || obj).response || obj).status || 404);
    console.error('GET_STOP_ARRIVALS request failed.');
  }
};

export const GET_ROUTES = async (
  stopCode,
  successCallback = func,
  errorCallback = func
) => {
  console.log('getRoutes()');
  errorCallback(null);
  try {
    const { data } = await API_GET_ROUTES_FOR_STOP(stopCode);
    const curatedData = (data || arr)
      .filter(route => route.RouteCode != null && route.LineID != null)
      .map(route => ({
        id: route.RouteCode,
        title: route.RouteDescr || route.LineDescr,
        line: route.LineID,
      }));
    if(curatedData.length > 0) {
      updateStoredRoutes(curatedData);
      successCallback(getStoredRoutes());
    }
  } catch(err) {
    errorCallback(((err || obj).response || obj).status || 404);
    console.error('GET_ROUTES_FOR_STOP request failed.');
  }
};
