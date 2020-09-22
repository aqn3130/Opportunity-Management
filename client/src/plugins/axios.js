import axios from "axios";
const thisAxios = axios.create({
  baseURL: "/api/"
});

// Add a request interceptor
thisAxios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
// Object.defineProperties(Vue.prototype,{
//     axios: {
//         get() {
//             return Vue.axios = thisAxios;
//         }
//     }
// })
export default thisAxios;
