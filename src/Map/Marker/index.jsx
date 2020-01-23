import React, {useMemo} from 'react';
import { ReactComponent as LocationSvg } from '../../assets/location.inline.svg';
import c from '../../helpers/classNames';
import s from './index.module.scss';

const Marker = ({ size = 32, topFix = 4, left, top, text = '', isUser, onClick }) => {
  const style = useMemo(() => ({
    position: 'absolute',
    zIndex: 1,
    width: `${size}px`,
    left: `${left - (size / 2)}px`,
    top: `${top - (size - topFix)}px`,
  }), [size, left, top, topFix]);
  return (
    <div style={style}>
      {text && <div className={s.stopTitle}>{text}</div>}
      <LocationSvg onClick={onClick} className={c(s.marker, isUser && s.user)} />
    </div>
  );
};

export default Marker;
