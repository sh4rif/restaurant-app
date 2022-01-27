// import AsyncStorageLib from "@react-native-async-storage/async-storage";

// export const url = AsyncStorageLib.getItem('url')
export const baseURL = 'http://192.168.33.185/api/';
// export const baseURL = 'http://192.168.137.164/api/';
// export const baseURL = 'http://192.168.137.1/api/';
export const GET_ITEMS = 'get_items.php';
export const GET_AREAS = 'get_areas.php';
export const GET_TABLES = 'get_tables.php';
export const LOGIN = 'loginn_post.php';
export const PLACE_ORDER = 'save_order.php';
export const UPDATE_ORDER = 'update_order.php';
export const GET_ORDER = 'get_order.php';
export const VERIFY_MEMBER = 'verify_member.php';

export const blankOrder = {
  id: '',
  empno: '',
  qot: '',
  table_id: '',
  order_id: '',
  order_no : '',
  order_date: '',
  member_id: '',
  order: [],
};

export const storageVarNames = {
  url: 'url',
  area: 'area',
};
