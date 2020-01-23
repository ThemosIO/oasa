import React, {useState, useEffect, useCallback} from 'react';
import Map from 'pigeon-maps';
import throttle from 'lodash/throttle';
import { remToPx } from '../helpers/remToPx';
import useGeo from '../helpers/useGeo';
import { getStorage, updateStorage } from '../helpers/localStorage';
import { GET_CLOSEST_STOPS } from '../helpers/api';
import Marker from './Marker';
import { testData } from '../helpers/testData';
import s from './index.module.scss';

const arr = [];
const obj = {};

const MapComponent = ({ idCallback = () => {} }) => {
  const [coords, error, loading] = useGeo(); // lat, lon
  const [zoom, setZoom] = useState(16);
  const [center, setCenter] = useState(null);
  const [prevCoords, setPrevCoords] = useState(null);
  const [closestStops, setClosestStops] = useState(getStorage());
  const [apiError, setApiError] = useState(null);

  const getStops = async ({ lat, lon }) => {
    console.log('getClosestStops()');
    setApiError(null);
    try {
      const { data } = await GET_CLOSEST_STOPS({lat, lon});
      // const data = testData;
      const curatedData = (data || arr)
        .filter(stop => stop.StopLat != null && stop.StopLng != null) // == used for null/undefined
        .map(stop => ({
          coords: [
            parseFloat(parseFloat(stop.StopLat).toFixed(5)),
            parseFloat(parseFloat(stop.StopLng).toFixed(5)),
          ],
          title: stop.StopDescr || stop.StopDescrEng || 'Bus Stop',
          str: `${stop.StopHeading} ${stop.StopStreet || stop.StopStreetEng}`,
          code: stop.StopCode,
          id: stop.StopID,
        }));
      if(curatedData.length > 0) {
        setClosestStops(curatedData);
        updateStorage(curatedData);
      }
    } catch(err) {
      setApiError(((err || obj).response || obj).status || 404);
      console.error('GET_CLOSEST_STOPS request failed.');
    }
  };

  const throttledGetStops = useCallback(throttle(getStops, 5000), []);

  useEffect(() => { // update center if geo changed
    if((prevCoords || arr).join() === (coords || arr).join()) return;
    console.log('coords useEffect');
    (coords || arr).length === 2 && throttledGetStops({ lat: coords[0], lon: coords[1] });
    setPrevCoords(coords);
    setCenter(coords);
  }, [coords, center, prevCoords]);

  useEffect(() => { // make api call again if error occurs.
    if(!apiError) return;
    console.log('throttled useEffect');
    (coords || arr).length === 2 && throttledGetStops({ lat: coords[0], lon: coords[1] });
  }, [apiError]);

  const clickHandler = id => () => idCallback(id);
  const mapHandler = ({ center, zoom }) => {
    setZoom(zoom);
    setCenter(center);
  };

  console.log(closestStops, coords);

  return !prevCoords && (loading || error)
    ? <div>{error ? 'error' : 'loading'}</div>
    : <div className={s.map}>
        <Map center={center || coords} zoom={zoom} defaultHeight={remToPx(24)} attribution={false}
             twoFingerDrag metaWheelZoom onBoundsChanged={mapHandler}>
          <Marker anchor={coords} size={45} />
          {closestStops.map(stop =>
            <Marker key={stop.id} anchor={stop.coords} size={45} isStop={stop.title}
                    onClick={clickHandler(stop.id)} />)}
        </Map>
      </div>;
};

export default MapComponent;
