import React, {useMemo} from 'react';
import { ReactComponent as LocationSvg } from '../../assets/location.inline.svg';
import s from './index.module.scss';

const Marker = ({ size = 32, topFix = 4, left, top, isStop = '', onClick = () => {} }) => {
  const style = useMemo(() => ({
    minWidth: `${size}px`,
    left: `${left - (size / 2)}px`,
    top: `${top - (size - topFix)}px`,
  }), [size, left, top, topFix]);

  return (
    <div style={style} className={s.container} onClick={onClick}>
      {isStop
        ? <div className={s.stopTitle}>{isStop}</div>
        : <LocationSvg className={s.marker} />}
    </div>
  );
};

export default Marker;
