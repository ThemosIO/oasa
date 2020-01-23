import React, {useState} from 'react';
import Map from './Map';
import s from './App.module.scss';

const App = () => {
  const [id, setId] = useState(null);
  const idCallback = selectedId => setId(selectedId);
  return (
    <div className={s.App}>
      <Map idCallback={idCallback}/>
      <div className={s.data}>
        <p>{id}</p>
      </div>
    </div>
  );
};

export default App;
