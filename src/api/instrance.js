import axios from "axios";
const env = process.env.REACT_APP_ENV || "production";
const instance = axios.create({
  baseURL:
    env === "production"
      ? "https://apiv3.jamiatreporting.com/api/v1/"
      : "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json", // Set default headers
    // Add other default headers if needed
  },
});

export default instance;
