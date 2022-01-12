import AsyncStorageLib from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {baseURL, storageVarNames} from '.';

export default axios.create({
    baseURL: baseURL
})

// const axiosClient = axios.create();

// axiosClient.interceptors.request.use(async config => {
//   try {
//     config.baseURL = await AsyncStorageLib.getItem(storageVarNames.url);
//   } catch (e) {
//     config.baseURL = baseURL;
//   }
// });

// export default axiosClient;
