import axios from 'axios';
import { getStoredRoutes, updateStoredRoutes } from './localStorage';

const obj = {};
const arr = [];
const func = () => {};
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const api = axios.create({
  baseURL: '/api', // proxied through netlify.toml
  timeout: 4000,
  headers: { 'Access-Control-Allow-Origin': '*' },
});

const API_GET_STOP_ARRIVALS = stopCode => {
  if(!stopCode) return;
  source.cancel();
  return api.get(`/?act=getStopArrivals&p1=${stopCode}`, { cancelToken: source.token });
};

const API_GET_ROUTES_FOR_STOP = stopCode => stopCode &&
  api.get(`/?act=webRoutesForStop&p1=${stopCode}`);

export const GET_ARRIVALS = async (
  stopCode,
  successCallback = func,
  errorCallback = func,
  timestampCallback = func,
) => {
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
      timestampCallback(new Date());
      successCallback(curatedData);
    }
  } catch(err) {
    if(axios.isCancel(err)){
      console.error('>> GET_STOP_ARRIVALS request cancelled.');
    } else {
      errorCallback(((err || obj).response || obj).status || 404);
      console.error('>> GET_STOP_ARRIVALS request failed.');
    }
  }
};

export const GET_ROUTES = async (
  stopCode,
  successCallback = func,
  errorCallback = func
) => {
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
    console.error('>> GET_ROUTES_FOR_STOP request failed.');
  }
};
