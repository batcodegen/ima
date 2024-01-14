import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  customerinfo: [],
  productinfo: [],
  locations: [],
  error: null,
};

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    onDeliveryFetchSuccess(state, action) {
      state.customerinfo = action.payload.customerinfo;
      state.productinfo = action.payload.productinfo;
      state.locations = action.payload.locations;
      state.error = null;
    },
    onDeliveryFetchError(state, action) {
      state.error = action.payload.error;
    },
  },
});

export const {onDeliveryFetchSuccess, onDeliveryFetchError} =
  deliverySlice.actions;
export default deliverySlice.reducer;
