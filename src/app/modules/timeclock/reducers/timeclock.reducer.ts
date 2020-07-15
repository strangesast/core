import { createReducer, on } from '@ngrx/store';
// import { init, login, logout } from '../actions/user.actions';
// import { User } from '../util/models';

export interface State {
  init: boolean;
  token: string;
  notifications: Notification[];
}

export const initialState: State = {
  init: false,
  token: null,
  notifications: [],
};

// const reducer = createReducer(
//   initialState,
//   on(init, (state) => ({ ...state, init: true })),
//   on(login, (state, { user, token }) => ({ ...state, user, token })),
//   on(logout, (state) => ({ ...state, user: null, token: null }))
// );
// 
// export function userReducer(state, action) {
//   return reducer(state, action);
// }