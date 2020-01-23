const arr = [];
const obj = {};

export const updateStorage = data => {
  (data || arr).forEach(d => d.id && window.localStorage.setItem(d.id, JSON.stringify(d)));
};
export const getStorage = () => {
  const storage = window.localStorage;
  return Object.keys(storage || obj)
    .filter(key => storage.hasOwnProperty(key))
    .map(key => JSON.parse(storage.getItem(key)));
};
export const clearStorage = () => window.localStorage.clear();
