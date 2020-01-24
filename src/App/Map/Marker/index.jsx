import React, {useMemo} from 'react';
import { ReactComponent as LocationSvg } from '../../../assets/location.inline.svg';
import { pxToRem } from '../../../helpers/remToPx';
import s from './index.module.scss';

const Marker = ({ left, top, isStop, onClick = () => {} }) => {
  const style = useMemo(() => ({
    left: `${pxToRem(left)}rem`,
    top: `${pxToRem(top)}rem`,
  }), [left, top]);

  return (
    <div style={style} className={s.container} onClick={onClick}>
      {isStop
        ? <div className={s.stop} />
        : <LocationSvg className={s.marker} />}
    </div>
  );
};

export default Marker;
