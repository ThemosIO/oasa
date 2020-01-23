import throttle from 'lodash/throttle';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Map from './Map';
import { getIdEntry } from './helpers/localStorage';
import { GET_STOP_ARRIVALS } from './helpers/api';
import s from './App.module.scss';

const obj = {};
const arr = [];

const App = () => {
  const [id, setId] = useState(null);
  const [apiError, setApiError] = useState(null);
  const stop = useMemo(() => getIdEntry(id), [id]);
  const [arrivals, setArrivals] = useState([]);

  const getArrivals = async stopCode => {
    console.log('getArrivals()');
    setApiError(null);
    try {
      const { data } = await GET_STOP_ARRIVALS(stopCode);
      console.log('>>>', data);
      const curatedData = (data || arr)
        .filter(arrival => arrival.veh_code != null && arrival.btime2 != null) // is null/undefined?
        .map(arrival => ({
          vehicle: arrival.veh_code,
          minutes: arrival.btime2,
        }));
      if(curatedData.length > 0) {
        setArrivals(curatedData);
      }
    } catch(err) {
      setApiError(((err || obj).response || obj).status || 404);
      console.error('GET_STOP_ARRIVALS request failed.');
    }
  };

  const throttledGetArrivals = useCallback(throttle(getArrivals, 15000), []);

  useEffect(() => { // make api call again if error occurs.
    if(!apiError) return;
    console.log('throttled useEffect');
    (stop || obj).code && throttledGetArrivals(stop.code);
  }, [apiError]);

  useEffect(() => { // make api call again if id changes.
    if(!id) return;
    console.log('throttled useEffect for id');
    (stop || obj).code && throttledGetArrivals(stop.code);
  }, [id]);

  const idCallback = selectedId => setId(selectedId);
  const refreshHandler = () => (stop || obj).code && getArrivals(stop.code);

  const mapStyle = useMemo(() => ({ height: id ? '50vh' : '100vh'}), [id]);

  return (
    <div className={s.App}>
      <Map idCallback={idCallback} style={mapStyle}/>
      {id &&
        <div className={s.data}>
          <p>{`${(stop || obj).title || ''} (${(stop || obj).str || ''})`}</p>
          <ul>
            {arrivals.map(({vehicle = '', minutes = ''}) =>
              <li>{`${vehicle} (${minutes})`}</li>)}
          </ul>
          <div className={s.button} onClick={refreshHandler}>Refresh</div>
        </div>
      }
    </div>
  );
};

export default App;
