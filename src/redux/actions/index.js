import {LOGIN} from '../types';

export const loginAction = payload => async dispatch => {
  dispatch({type: LOGIN, payload: payload});
};
