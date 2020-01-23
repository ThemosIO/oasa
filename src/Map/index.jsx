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

  const getClosestStops = async ({ lat, lon }) => {
    const { data } = await axios.get(GET_CLOSEST_STOPS({ lat, lon }));
    console.log(data);
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
          <Marker anchor={coords} size={45} onClick={clickHandler} />
        </Map>
      </div>;
};

export default MapComponent;
