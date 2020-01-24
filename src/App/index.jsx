import throttle from 'lodash/throttle';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Map from './Map';
import { getStoredStop, getStoredRoutes } from '../helpers/localStorage';
import { GET_ROUTES, GET_ARRIVALS } from '../helpers/api';
import s from './index.module.scss';

const obj = {};
const arr = [];

// TODO: reset errors, data etc when id changes
// TODO: some routes don't appear check stop response
// TODO: create clock component that countdowns to refresh requests
// TODO: Bottom part of screen is topleft: title, right: arrivals, bottomLeft: requests

const Index = () => {
  const [loadMap, setLoadMap] = useState(false);
  const [updateTimestamp, setUpdateTimestamp] = useState('');
  const [apiArrivalError, setApiArrivalError] = useState(null);
  const [apiRouteError, setApiRouteError] = useState(null);
  const [arrivals, setArrivals] = useState([]);
  const [routes, setRoutes] = useState(getStoredRoutes());
  const [stopId, setStopId] = useState(null);
  const stop = useMemo(() => getStoredStop(stopId), [stopId]);

  const getRoutes = id => GET_ROUTES(id, setRoutes, setApiRouteError);
  const throttledGetRoutes = useCallback(throttle(getRoutes, 10000), []);
  const getArrivals = id => GET_ARRIVALS(id, setArrivals, setApiArrivalError, setUpdateTimestamp);
  const throttledGetArrivals = useCallback(throttle(getArrivals, 10000), []);

  useEffect(() => { // make api call again if error occurs.
    if(!stopId) return;
    console.log('throttled useEffect');
    apiArrivalError && throttledGetArrivals(stopId);
    apiRouteError && throttledGetRoutes(stopId);
  }, [apiArrivalError, apiRouteError, stopId]);

  const stopCallback = stopId => { // when stop id changes, reset
    setUpdateTimestamp('');
    setApiArrivalError(null);
    setApiRouteError(null);
    setArrivals([]);
    setStopId(stopId);
  };

  const refreshHandler = () => {
    if(!stopId) return;
    getArrivals(stopId);
    getRoutes(stopId);
  };
  const loadMapHandler = () => setLoadMap(true);

  const curatedArrivals = useMemo(() => arrivals.map(({route = '', minutes = ''}) => {
    const foundRoute = (routes || arr).find(r => r.id === route) || obj;
    return `${minutes || '?'}min ${foundRoute.line || ''} ${foundRoute.title || ''}`;
  }), [updateTimestamp, (routes || arr).length, (arrivals || arr).length]);

  console.log(curatedArrivals);
  return (
    <div className={s.app}>
      {loadMap
        ? <Map stopCallback={stopCallback} />
        : <div className={s.prompt} onClick={loadMapHandler}>Load Map</div>}
      {stopId &&
        <div className={s.data}>
          <p>{`${stop.title || ''} ${stop.street ? `(${stop.street})` : ''}`}</p>
          <ul>{curatedArrivals.map(arrival => <li key={arrival}>{arrival}</li>)}</ul>
          <div className={s.button} onClick={refreshHandler}>Refresh</div>
          {updateTimestamp && <p className={s.timestamp}>{`Last updated: ${updateTimestamp}`}</p>}
        </div>
      }
    </div>
  );
};

export default Index;
