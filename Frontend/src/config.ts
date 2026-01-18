// This file contains the configuration for the frontend application.
interface Config {
  API_BASE_URL: string;
  TEST_MODE: boolean;
}

const config: Config = {
  API_BASE_URL: "http://127.0.0.1:8000", // Backend API URL
  TEST_MODE: false, // Toggle test mode
};

export default config;