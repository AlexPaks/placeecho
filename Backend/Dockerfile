FROM python:3.12-slim

WORKDIR /app

# Install poetry
RUN pip install --no-cache-dir poetry

# Copy only dependency files first (for caching)
COPY pyproject.toml poetry.lock ./

# Disable venv inside container
RUN poetry config virtualenvs.create false

# Install deps into container python
RUN poetry install --no-root

# Copy rest of project
COPY . .

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
