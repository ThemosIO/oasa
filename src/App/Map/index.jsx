import React, {useState, useEffect, useCallback} from 'react';
import Map from 'pigeon-maps';
import throttle from 'lodash/throttle';
import { remToPx } from '../../helpers/remToPx';
import useGeo from '../../helpers/useGeo';
import geoDistance from '../../helpers/geoDistance';
import { getStoredStops } from '../../helpers/localStorage';
import { GET_STOPS } from '../../helpers/api';
import Marker from './Marker';
import s from './index.module.scss';

const arr = [];
const func = () => {};

const MapComponent = ({ stopCallback = func }) => {
  const [coords, error, loading] = useGeo(); // lat, lon
  const [center, setCenter] = useState(null);
  const [prevCenter, setPrevCenter] = useState(null);
  const [closestStops, setClosestStops] = useState(getStoredStops());
  const [apiStopError, setApiStopError] = useState(null);

  const getStops = coords => GET_STOPS(coords, setClosestStops, setApiStopError);
  const throttledGetStops = useCallback(throttle(getStops, 5000), []);

  useEffect(() => { // make api call again if error occurs or center changed enough.
    if(apiStopError || !prevCenter || geoDistance(center, prevCenter) > 100) {
      (center || arr).length === 2 && throttledGetStops(center);
      setPrevCenter(center);
    }
  }, [apiStopError, center]);

  const clickHandler = id => () => stopCallback(id);
  const mapClickHandler = () => stopCallback(null);
  const mapHandler = ({ center }) => { setCenter(center); };

  return (loading || error)
    ? <div>{error ? 'error' : 'loading'}</div>
    : <div className={s.map}>
        <Map defaultCenter={coords} defaultZoom={16} defaultHeight={remToPx(24)}
             attribution={false} onBoundsChanged={mapHandler} onClick={mapClickHandler}>
          <Marker anchor={coords} size={45} />
          {closestStops.map((stop, i) =>
            <Marker key={stop.id + i} anchor={stop.coords} size={45} isStop
                    onClick={clickHandler(stop.id)} />)}
        </Map>
      </div>;
};

export default MapComponent;
