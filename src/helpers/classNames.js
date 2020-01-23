const classNames = (...classes) =>
  classes.filter(c => !!c && (typeof c === 'string' || c instanceof String)).join(' ');

export default classNames;
