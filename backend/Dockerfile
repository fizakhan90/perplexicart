# backend/Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt
COPY . .

# Copy the entrypoint script and make it executable
COPY entrypoint.sh .
RUN chmod +x ./entrypoint.sh 

# EXPOSE the default port your script will use if PORT isn't set,
# or the port Render expects. Render will map this.
EXPOSE 8000 

# Run the entrypoint script
ENTRYPOINT ["./entrypoint.sh"]
# CMD can be used to pass default arguments to ENTRYPOINT if needed, but not necessary here