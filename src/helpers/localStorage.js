const arr = [];
const obj = {};

export const updateStoredRoutes = data => (data || arr)
  .forEach(d => d.id && window.localStorage.setItem(d.id, JSON.stringify(d)));

export const getStoredRoutes = () => {
  const storage = window.localStorage;
  return Object.keys(storage || obj)
    .filter(key => storage.hasOwnProperty(key))
    .map(key => JSON.parse(storage.getItem(key)) || '{}');
};
