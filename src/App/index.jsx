import throttle from 'lodash/throttle';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getStoredRoutes } from '../helpers/localStorage';
import { GET_ROUTES, GET_ARRIVALS } from '../helpers/api';
import s from './index.module.scss';

const stop = { id: '420200', title: '7η Στάση' };
const obj = {};
const arr = [];

const Index = () => {
  const [updateTimestamp, setUpdateTimestamp] = useState('');
  const [apiArrivalError, setApiArrivalError] = useState(null);
  const [apiRouteError, setApiRouteError] = useState(null);
  const [arrivals, setArrivals] = useState([]);
  const [routes, setRoutes] = useState(getStoredRoutes());

  const getRoutes = id => GET_ROUTES(id, setRoutes, setApiRouteError);
  const throttledGetRoutes = useCallback(throttle(getRoutes, 10000), []);
  const getArrivals = id => GET_ARRIVALS(id, setArrivals, setApiArrivalError, setUpdateTimestamp);
  const throttledGetArrivals = useCallback(throttle(getArrivals, 5000), []);

  useEffect(() => { // make api call again if error occurs.
    (apiArrivalError || apiArrivalError === null) && throttledGetArrivals(stop.id);
    (apiRouteError || apiRouteError === null) && throttledGetRoutes(stop.id);
  }, [apiArrivalError, apiRouteError]);

  const refreshHandler = () => {
    getArrivals(stop.id);
    getRoutes(stop.id);
  };

  const curatedArrivals = useMemo(() => arrivals.map(({route = '', minutes = ''}) => {
    const foundRoute = (routes || arr).find(r => r.id === route) || obj;
    return [`${minutes || '?'}min`, `${foundRoute.line || ''} ${foundRoute.title || ''}`];
  }), [updateTimestamp, (routes || arr).length, (arrivals || arr).length]);

  console.log(updateTimestamp, routes, arrivals);
  return (
    <div className={s.app}>
      <div className={s.button} onClick={refreshHandler}>Refresh</div>
      <p>{`${stop.title} (${stop.id})`}</p>
      <ul>{curatedArrivals.map(a =>
        <li key={a.join()}>{a[0]}<p>{a[1]}</p></li>)}
      </ul>
      {updateTimestamp && <p className={s.timestamp}>{`Last updated: ${updateTimestamp}`}</p>}
    </div>
  );
};

export default Index;
