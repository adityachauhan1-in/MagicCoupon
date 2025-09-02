FROM node:20

WORKDIR /app

# Copy sirf package.json aur package-lock.json
COPY package*.json ./

# Clean install force kar
RUN npm install --legacy-peer-deps

# Ab code copy kar
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
