import axios from 'axios';
import throttle from 'lodash/throttle';
import Countdown from 'react-countdown';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getStoredRoutes } from '../helpers/localStorage';
import { GET_ROUTES, GET_ARRIVALS } from '../helpers/api';
import s from './index.module.scss';

const refreshSec = 60;
const stop = { id: '420200', title: '7η Στάση' };
const obj = {};
const arr = [];

const Index = () => {
  const [getArrivalsToken, setGetArrivalsToken] = useState(axios.CancelToken.source());
  const [refreshOn, setRefreshOn] = useState(null);
  const [updatedOn, setUpdatedOn] = useState(null);
  const [apiArrivalError, setApiArrivalError] = useState(null);
  const [arrivals, setArrivals] = useState([]);
  const [routes, setRoutes] = useState(getStoredRoutes());
  const timeStr = date => date instanceof Date && date.getTime();

  const getRoutes = stopCode => GET_ROUTES({ stopCode, successCallback: setRoutes });
  const throttledGetRoutes = useCallback(throttle(getRoutes, 10000), []);
  const getArrivals = ({ stopCode, cancelSource }) => GET_ARRIVALS({
    cancelSource,
    stopCode,
    successCallback: setArrivals,
    errorCallback: setApiArrivalError,
    timestampCallback: setUpdatedOn,
  });
  const throttledGetArrivals = useCallback(throttle(getArrivals, 10000), []);

  useEffect(() => { // make api calls (repeat if error occurs).
    (routes || arr).length === 0 && throttledGetRoutes(stop.id);
    console.log('GONNA REFRESH?', apiArrivalError, !updatedOn, refreshOn);
    if(apiArrivalError || !updatedOn || refreshOn){
      console.log('GONNA REFRESH!');
      throttledGetArrivals({ stopCode: stop.id, cancelSource: getArrivalsToken });
    }
    setRefreshOn(null);
  }, [timeStr(refreshOn), apiArrivalError, updatedOn]);

  const refreshHandler = () => {
    console.log('REFRESH!');
    setGetArrivalsToken(axios.CancelToken.source()); // reset request cancels on refresh
    setRefreshOn(new Date());
  };

  const refreshLoop = () => setInterval(refreshHandler, refreshSec * 1000);

  useEffect(() => { // refresh every minute
    const interval = refreshLoop();
    return () => clearInterval(interval);
  }, []);

  const curatedArrivals = useMemo(() => arrivals.map(({route = '', minutes = ''}) => {
    const foundRoute = (routes || arr).find(r => r.id === route) || obj;
    const date = updatedOn && new Date(updatedOn.getTime() + (+minutes * 60000));
    return { minutes, date, title: foundRoute.title || '', line: foundRoute.line || ''};
  }), [timeStr(updatedOn), (routes || arr).length, (arrivals || arr).length]);

  console.log(updatedOn, routes, arrivals, curatedArrivals);

  return (
    <div className={s.app} onClick={refreshHandler}>
      <div>
        {`${stop.title}${updatedOn ? ` (updated ${updatedOn.toLocaleTimeString()})` : ''}`}
      </div>
      <ul>{curatedArrivals.map((a, i) =>
        <li key={i}>
          <Countdown date={a.date} />
          {`${a.minutes}min (${a.line})`}
        </li>)}
      </ul>
    </div>
  );
};

export default Index;
