// import AsyncStorageLib from "@react-native-async-storage/async-storage";

// export const url = AsyncStorageLib.getItem('url')
export const baseURL = 'http://192.168.33.185/api/';
// export const baseURL = 'http://192.168.137.164/api/';
// export const baseURL = 'http://192.168.137.1/api/';
export const GET_ITEMS = 'get_items.php';
export const GET_AREAS = 'get_areas.php';
export const GET_TABLES = 'get_tables.php';
export const LOGIN = 'loginn_post.php';
export const PLACE_ORDER = 'saveorder.php';

export const blankOrder = {
  empno: '',
  table_id: '',
  order_date: '',
  order_time: '',
  order: [],
};

export const storageVarNames ={
  url: 'url',
  area: 'area',
}