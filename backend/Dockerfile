# backend/Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt
COPY . .


COPY entrypoint.sh .
RUN chmod +x ./entrypoint.sh 


EXPOSE 8000 


ENTRYPOINT ["./entrypoint.sh"]
