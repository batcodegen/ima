const round = number => Math.round(number * 100) / 100;

const monitorReducerEnhancer =
  createStore => (reducer, initialState, enhancer) => {
    const monitoredReducer = (state, action) => {
      const start = performance.now();
      const newState = reducer(state, action);
      const end = performance.now();
      const diff = round(end - start);

      console.log('\x1b[35m', 'reducer process time:', diff, '\x1b[0m');

      return newState;
    };

    return createStore(monitoredReducer, initialState, enhancer);
  };

export default monitorReducerEnhancer;
