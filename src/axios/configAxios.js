import axios from "axios";

const instance = axios.create({
    baseURL: "https://nhammernblog.click",
    withCredentials: true,
});

export default instance;
