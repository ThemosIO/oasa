import throttle from 'lodash/throttle';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Map from './Map';
import { getStoredStop, updateStoredStops } from '../helpers/localStorage';
import { GET_STOP_ARRIVALS, GET_ROUTES_FOR_STOP } from '../helpers/api';
import s from './index.module.scss';

const obj = {};
const arr = [];

// TODO: reset errors, data etc when id changes
// TODO: some routes don't appear check stop response
// TODO: create clock component that countdowns to refresh requests
// TODO: Bottom part of screen is topleft: title, right: arrivals, bottomLeft: requests

const App = () => {
  const [updateTimestamp, setUpdateTimestamp] = useState('');
  const [apiError, setApiError] = useState(null);
  const [apiRouteError, setApiRouteError] = useState(null);
  const [arrivals, setArrivals] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [code, setCode] = useState(null);

  const stop = useMemo(() => ({ ...getStoredStop(code), routes }), [code, routes.length]);

  // const [lineList, setLineList] = useState(getStoredLines() || arr);
  // const [apiLinesError, setApiLinesError] = useState(null);
  // const getLines = async () => {
  //   console.log('getLines()');
  //   setApiLinesError(null);
  //   try {
  //     const { data } = await GET_LINES();
  //     console.log('>>>', data);
  //     const curatedData = (data || arr)
  //       .filter(line => line.Line_ID != null && line.Line_Code != null) //is null/undefined
  //       .map(line => ({
  //         id: line.Line_ID,
  //         code: line.Line_Code,
  //         title: line.Line_Descr || line.Line_Descr_Eng,
  //       }));
  //     if(curatedData.length > 0) {
  //       setLineList(curatedData);
  //       updateStoredLines(curatedData);
  //     }
  //   } catch(err) {
  //     setApiLinesError(((err || obj).response || obj).status || 404);
  //     console.error('GET_LINES request failed.');
  //   }
  // };
  // const throttledGetLines = useCallback(throttle(getLines, 15000), []);
  // useEffect(() => { // make api call to fill lines once.
  //   if(!apiLinesError || (lineList || arr).length) return;
  //   throttledGetLines();
  //   console.log('throttled getLines useEffect');
  // }, [apiLinesError]);

  const getArrivals = async stopCode => {
    console.log('getArrivals()');
    setApiError(null);
    try {
      const { data } = await GET_STOP_ARRIVALS(stopCode);
      const curatedData = (data || arr)
        .filter(arrival => arrival.route_code != null && arrival.btime2 != null)
        .map(arrival => ({
          route: arrival.route_code,
          minutes: arrival.btime2,
        }));
      if(curatedData.length > 0) {
        setArrivals(curatedData);
        setUpdateTimestamp(new Date().toLocaleTimeString());
      }
    } catch(err) {
      setApiError(((err || obj).response || obj).status || 404);
      console.error('GET_STOP_ARRIVALS request failed.');
    }
  };

  const getRoutes = async stopCode => {
    console.log('getRoutes()');
    setApiRouteError(null);
    try {
      const { data } = await GET_ROUTES_FOR_STOP(stopCode);
      const curatedData = (data || arr)
        .filter(route => route.RouteCode != null && route.LineID != null)
        .map(route => ({
          route: route.RouteCode,
          line: route.LineID,
          title: route.RouteDescr || route.LineDescr,
        }));
      if(curatedData.length > 0) {
        setRoutes(curatedData);
        updateStoredStops([{ ...stop, routes: curatedData }]);
      }
    } catch(err) {
      setApiRouteError(((err || obj).response || obj).status || 404);
      console.error('GET_ROUTES_FOR_STOP request failed.');
    }
  };

  const throttledGetArrivals = useCallback(throttle(getArrivals, 10000), []);

  const throttledGetRoutes = useCallback(throttle(getRoutes, 10000), []);

  useEffect(() => { // make api call again if error occurs.
    if(!(stop || obj).code) return;
    console.log('throttled useEffect for error');
    apiError && throttledGetArrivals(stop.code);
    apiRouteError && throttledGetRoutes(stop.code);
  }, [apiError, apiRouteError]);

  useEffect(() => { // make api call again if id changes.
    if(!code || !(stop || obj).code) return;
    console.log('throttled useEffect for id');
    throttledGetArrivals(stop.code);
    throttledGetRoutes(stop.code);
  }, [code]);

  const codeCallback = selectedCode => setCode(selectedCode);
  const refreshHandler = () => {
    if(!(stop || obj).code) return;
    getArrivals(stop.code);
    getRoutes(stop.code);
  };

  const mapStyle = useMemo(() => ({ height: code ? '50vh' : '100vh'}), [!!code]);
  const list = arrivals.map(({route = '', minutes = ''}) => {
    const routeDetails = ((stop || obj).routes || arr).find(r => r.route === route);
    const descr = [`${minutes || '?'} min`, (routeDetails || obj).line, (routeDetails || obj).title]
      .filter(Boolean)
      .join(' | ');
    console.log(route, stop, routeDetails);
    return <li key={descr}>{descr}</li>;
  });

  return (
    <div className={s.App}>
      <Map codeCallback={codeCallback} style={mapStyle}/>
      {code &&
        <div className={s.data}>
          <p>{`${(stop || obj).title || ''} (${(stop || obj).str || ''})`}</p>
          {list.length > 0 && <ul>{list}</ul>}
          <div className={s.button} onClick={refreshHandler}>Refresh</div>
          {updateTimestamp && <p className={s.timestamp}>{`Last updated: ${updateTimestamp}`}</p>}
        </div>
      }
    </div>
  );
};

export default App;
