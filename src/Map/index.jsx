import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from 'pigeon-maps';
import { remToPx } from '../helpers/remToPx';
import useGeo from '../helpers/useGeo';
import { GET_CLOSEST_STOPS } from '../config';
import Marker from './Marker';
import s from './index.module.scss';

const arr = [];

const MapComponent = () => {
  const [coords, error, loading] = useGeo(); // lat, lon
  const [zoom, setZoom] = useState(14);
  const [center, setCenter] = useState(null);
  const [prevCoords, setPrevCoords] = useState(null);
  const [closestStops, setClosestStops] = useState(arr);

  const getClosestStops = async ({ lat, lon }) => {
    console.warn('GET_CLOSEST_STOPS request fired.');
    try {
      const {data} = await axios.get(GET_CLOSEST_STOPS({lat, lon}));
      const curatedData = (data || arr)
        .filter(stop => stop.StopLat && stop.StopLng)
        .map(({StopDescr, StopDescrEng, StopLat, StopLng}) =>
          ({coords: [StopLat, StopLng], title: StopDescr || StopDescrEng || 'Bus stop'}));
      curatedData.length > 0 && setClosestStops(curatedData);
    } catch {
      console.error('GET_CLOSEST_STOPS request failed.');
    }
  };

  useEffect(() => { // update center if geo changed
    if((prevCoords || arr).join() === (coords || arr).join()) return;
    (coords || arr).length === 2 && getClosestStops({ lat: coords[0], lon: coords[1] });
    setPrevCoords(coords);
    setCenter(coords);
  }, [ coords, center, prevCoords ]);

  const clickHandler = () => console.log('hi!');
  const mapHandler = ({ center, zoom }) => {
    setZoom(zoom);
    setCenter(center);
  };

  return loading || error
    ? <div>{error ? 'error' : 'loading'}</div>
    : <div className={s.map}>
        <Map center={center || coords} zoom={zoom} defaultHeight={remToPx(24)} attribution={false}
             twoFingerDrag metaWheelZoom onBoundsChanged={mapHandler}>
          <Marker isUser anchor={coords} size={45} onClick={clickHandler} />
          {closestStops.map(({ coords, title }) =>
            <Marker anchor={coords} size={45} text={title} onClick={clickHandler} />)}
        </Map>
      </div>;
};

export default MapComponent;
