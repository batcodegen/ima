import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  token: null,
  isLoggedIn: false,
  user: null,
  error: null,
  extras: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    onLogin(state, action) {
      const {token, user, ...restdata} = action.payload;
      state.token = token;
      state.isLoggedIn = true;
      state.extras = restdata;
      state.user = user;
      state.error = null;
    },
    onLoginError(state, action) {
      state.error = action.payload.error;
    },
    onLogout(state, action) {
      state.token = null;
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
    },
  },
});

export const {onLogin, onLogout, onLoginError} = authSlice.actions;
export default authSlice.reducer;
