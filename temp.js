version: '3.8'

services:
  backend:
    build:
      context: /Users/smallchen307/my-fullstack/part3
      dockerfile: Dockerfile
    ports:
      - "2999:2999"
    environment:
      - MONGODB_URI=mongodb://root:gundam7788@ubuntu.orb.local:27017/phonebook?authSource=admin
      - PORT=2999
      - NODE_ENV=development
