import http from "../util/http.js";

const API = {
  get: (url, params) => {
    return http({ url: url, method: "get", params: params });
  },
  del: (url, id) => {
    //url   /api/staff
    //id     12
    //url=/api/staff/12    代理处理    /api 换成代理路径    http://localhost:8080
    //url=http://localhost:8080/staff/12
    url = url + "/" + id;
    return http({ url: url, method: "delete" });
  },
  postForm: function (url, params) {
    return http({ url: url, method: "post", params: params });
  },
  postJson: function (url, data) {
    return http({ url: url, method: "post", data: data });
  },
  putForm: function (url, params) {
    return http({ url: url, method: "put", params: params });
  },
  putJson: function (url, data) {
    return http({ url: url, method: "put", data: data });
  },
};
export default API;
