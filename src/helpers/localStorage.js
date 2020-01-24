const arr = [];
const obj = {};
const PREFIX = {
  STOP: 'stop--',
  ROUTE: 'route--',
};

const update = prefix => data => (data || arr)
  .forEach(d => d.id && window.localStorage.setItem(`${prefix}${d.id}`, JSON.stringify(d)));

const getAll = prefix => () => {
  const storage = window.localStorage;
  return Object.keys(storage || obj)
    .filter(key => storage.hasOwnProperty(key) && key.indexOf(prefix) === 0)
    .map(key => JSON.parse(storage.getItem(key)) || '{}');
};

const getId = prefix => code => JSON.parse(window.localStorage.getItem(`${prefix}${code}`) || '{}');

// const clearStoredEntries = () => window.localStorage.clear();

export const updateStoredStops = update(PREFIX.STOP);
export const updateStoredRoutes = update(PREFIX.ROUTE);
export const getStoredStops = getAll(PREFIX.STOP);
export const getStoredRoutes = getAll(PREFIX.ROUTE);
export const getStoredStop = getId(PREFIX.STOP);
export const getStoredRoute = getId(PREFIX.ROUTE);
