# Copilot Instructions

## Overview
This document provides instructions for configuring and running the PlaceEcho project, including both the backend and frontend components. It also explains how to set up environment variables and ensure proper communication between the two parts of the application.

---

## Backend Configuration

### Environment Variables
The backend uses environment variables to configure its behavior. These variables are defined in a `.env` file or directly in the system environment. Below is a list of important variables:

- **`FRONTEND_ORIGIN`**: The origin of the frontend application (default: `http://localhost:5173`).
- **`OPENAI_API_KEY`**: Your OpenAI API key.
- **`REDIS_URL`**: The Redis server URL (default: `redis://localhost:6379/0`).
- **`AUDIO_PUBLIC_BASE_URL`**: Base URL for audio files (default: `http://localhost:8000/static`).
- **`MEDIA_PUBLIC_BASE_URL`**: Base URL for media files (default: `http://localhost:8000/static`).

### Running the Backend
1. Navigate to the `Backend` directory:
   ```sh
   cd Backend
   ```
2. Create and activate a virtual environment:
   ```sh
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```sh
   uvicorn app.main:app --reload
   ```
   The backend will be available at `http://localhost:8000`.

---

## Frontend Configuration

### Environment Variables
The frontend uses the `VITE_API_BASE_URL` variable to configure the API base URL. This can be set in a `.env` file in the `Frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Running the Frontend
1. Navigate to the `Frontend` directory:
   ```sh
   cd Frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

---

## Communication Between Frontend and Backend

Ensure the following configurations are in place for proper communication:

1. **Backend**:
   - The `FRONTEND_ORIGIN` environment variable in the backend should match the frontend's URL (e.g., `http://localhost:5173`).

2. **Frontend**:
   - The `VITE_API_BASE_URL` environment variable in the frontend should point to the backend's URL (e.g., `http://localhost:8000`).

---

## Troubleshooting

### CORS Errors
If you encounter CORS errors:
- Verify that the `FRONTEND_ORIGIN` in the backend matches the frontend's URL.
- Ensure the backend is running and accessible at the specified `VITE_API_BASE_URL`.

### Common Issues
- **Backend not starting**: Ensure all required environment variables are set.
- **Frontend not loading**: Check the `VITE_API_BASE_URL` and ensure the backend is running.

---

## Useful Commands

### Backend
- Start the server:
  ```sh
  uvicorn app.main:app --reload
  ```
- Run tests:
  ```sh
  pytest
  ```

### Frontend
- Start the development server:
  ```sh
  npm run dev
  ```
- Build for production:
  ```sh
  npm run build
  ```

---

## Additional Resources
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)