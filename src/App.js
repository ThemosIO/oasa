import React from 'react';
import Map from './Map';
import s from './App.module.scss';

const App = () => {
  return (
    <div className={s.App}>
      <Map />
      <div className={s.AppHeader}>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    </div>
  );
};

export default App;
