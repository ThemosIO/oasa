const arr = [];
const obj = {};

export const updateEntries = data => {
  (data || arr).forEach(d => d.id && window.localStorage.setItem(d.id, JSON.stringify(d)));
};
export const getAllEntries = () => {
  const storage = window.localStorage;
  return Object.keys(storage || obj)
    .filter(key => storage.hasOwnProperty(key))
    .map(key => JSON.parse(storage.getItem(key)) || '{}');
};
export const getIdEntry = id => JSON.parse(window.localStorage.getItem(id) || '{}');
export const clearEntries = () => window.localStorage.clear();
