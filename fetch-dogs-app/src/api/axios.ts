import axios from "axios";

const instance = axios.create({
  url: "https://frontend-take-home-service.fetch.com",
  withCredentials: true,
});

export default instance;
