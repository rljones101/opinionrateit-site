FROM mongo-express

EXPOSE 8081

CMD ["mongod", "--bind_ip", "0.0.0.0"]