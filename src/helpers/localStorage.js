const arr = [];
const obj = {};
// const LINES_ID = 'all-lines';
// export const getStoredLines = () => JSON.parse(window.localStorage.getItem(LINES_ID) || '[]');
// export const updateStoredLines = data =>
//   window.localStorage.setItem(LINES_ID, JSON.stringify(data || arr));

export const updateStoredStops = data => (data || arr)
  .forEach(d => d.id && window.localStorage.setItem(d.id, JSON.stringify(d)));


export const updateAllStoredEntries = () => {
  const storage = window.localStorage;
  return Object.keys(storage || obj)
    .filter(key => storage.hasOwnProperty(key))
    .map(key => JSON.parse(storage.getItem(key)) || '{}');
};

export const getStoredStop = id => JSON.parse(window.localStorage.getItem(id) || '{}');

export const clearStoredEntries = () => window.localStorage.clear();
