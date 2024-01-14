const logger = store => next => action => {
  console.group(action.type);
  console.info('\x1b[32m', 'dispatching', action, '\x1b[0m');
  let result = next(action);
  // console.log('\x1b[33m', 'next state', store.getState(), '\x1b[0m');
  console.groupEnd();
  return result;
};

export default logger;
