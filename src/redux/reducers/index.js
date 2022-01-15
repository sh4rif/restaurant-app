import {LOGIN, LOGOUT} from '../types';

const initialState = {
  isLoggedIn: false,
  loginTime: null,
  loginDate: null,
  user: null,
  tables: [],
  qot: null,
  menu: {
    table_id: null,
    empno: null,
    qot: null,
    items: [],
  },
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        loginDate: new Date(),
        loginTime: 'time here',
        user: action.payload,
      };
    case LOGOUT:
      return {...initialState};

    default:
      return {...state};
  }
};

export default loginReducer;
