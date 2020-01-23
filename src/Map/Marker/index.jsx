import React from 'react';
import { ReactComponent as LocationSvg } from '../../assets/location.inline.svg';
import s from './index.module.scss';

const Marker = ({ size = 32, topFix = 4, left, top, onClick }) => {
  const style = {
    width: `${size}px`,
    left: `${left - (size / 2)}px`,
    top: `${top - (size - topFix)}px`,
  };
  return <LocationSvg onClick={onClick} className={s.marker} style={style} />;
};

export default Marker;
