import throttle from 'lodash/throttle';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getStoredRoutes } from '../helpers/localStorage';
import { GET_ROUTES, GET_ARRIVALS } from '../helpers/api';
import s from './index.module.scss';

const refreshSec = 60;
const stop = { id: '420200', title: '7η Στάση' };
const obj = {};
const arr = [];

const Index = () => {
  const [refreshOn, setRefreshOn] = useState(null);
  const [updatedOn, setUpdatedOn] = useState(null);
  const [apiArrivalError, setApiArrivalError] = useState(null);
  const [apiRouteError, setApiRouteError] = useState(null);
  const [arrivals, setArrivals] = useState([]);
  const [routes, setRoutes] = useState(getStoredRoutes());
  const timeStr = date => date instanceof Date && date.toLocaleTimeString();

  const getRoutes = id => GET_ROUTES(id, setRoutes, setApiRouteError);
  const throttledGetRoutes = useCallback(throttle(getRoutes, 10000), []);
  const getArrivals = id => GET_ARRIVALS(id, setArrivals, setApiArrivalError, setUpdatedOn);
  const throttledGetArrivals = useCallback(throttle(getArrivals, 5000), []);

  useEffect(() => { // make api calls (repeat if error occurs).
    if(apiArrivalError || apiArrivalError === null || timeStr(refreshOn)){
      throttledGetArrivals(stop.id);
    }
    if(apiRouteError || apiRouteError === null || timeStr(refreshOn)){
      throttledGetRoutes(stop.id);
    }
    setRefreshOn(null);
  }, [timeStr(refreshOn), apiArrivalError, apiRouteError]);

  const refreshHandler = () => {
    console.log('REFRESH!');
    setRefreshOn(Date.now());
  };

  useEffect(() => { // refresh every minute
    const interval = setInterval(refreshHandler, refreshSec * 1000);
    return () => clearInterval(interval);
  }, []);

  const curatedArrivals = useMemo(() => arrivals.map(({route = '', minutes = ''}) => {
    const foundRoute = (routes || arr).find(r => r.id === route) || obj;
    const date = updatedOn instanceof Date && new Date(updatedOn + (+minutes * 60000));
    return { minutes, date, title: foundRoute.title || '', line: foundRoute.line || ''};
  }), [timeStr(updatedOn), (routes || arr).length, (arrivals || arr).length]);

  console.log(updatedOn, routes, arrivals, curatedArrivals);

  return (
    <div className={s.app} onClick={refreshHandler}>
      <div>
        {`${stop.title}${updatedOn ? ` (updated ${updatedOn.toLocaleTimeString()})` : ''}`}
      </div>
      <ul>{curatedArrivals.map((a, i) =>
        <li key={i}>{`${a.line}: ${a.minutes}min`}</li>)}
      </ul>
    </div>
  );
};

export default Index;
