import axios from "axios";

const fetchEndpointData = (params, method, url, token) => {
  return axios({
    method: method.toLowerCase(),
    url: url,
    params: params,
    headers: { Authorization: `Bearer ${token}` },
  });
};

const createEndpointData = (method, url, data, token) => {
  return axios({
    method: method.toLowerCase(),
    url: url,
    headers: { Authorization: `Bearer ${token}` },
    data: data,
  });
};

const fetchSpecificEndpointData = (method, url, token) => {
  return axios({
    method: method.toLowerCase(),
    url: url,
    headers: { Authorization: `Bearer ${token}` },
  });
};

const updateSpecificEndpointData = (method, url, data, token) => {
  return axios({
    method: method.toLowerCase(),
    url: url,
    headers: { Authorization: `Bearer ${token}` },
    data: data,
  });
};

const createMediaEndpointData = (method, url, data, token) => {
  return axios({
    method: method.toLowerCase(),
    url: url,
    headers: { Authorization: `Bearer ${token}` },
    data: data
  });
};
export {
  fetchEndpointData,
  createEndpointData,
  fetchSpecificEndpointData,
  updateSpecificEndpointData,
  createMediaEndpointData,
};
