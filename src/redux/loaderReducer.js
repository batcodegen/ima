import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
};

const appLoaderSlice = createSlice({
  name: 'apploader',
  initialState,
  reducers: {
    updateLoaderState(state, action) {
      state.isLoading = action.payload.isLoading;
    },
  },
});

export const {updateLoaderState} = appLoaderSlice.actions;
export default appLoaderSlice.reducer;
