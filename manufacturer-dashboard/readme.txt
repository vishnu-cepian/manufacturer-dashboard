mkdir manufacturer-dashboard
cd manufacturer-dashboard
mkdir backend
cd backend

npm init -y 
npm install express cors dotenv mongoose web3 ipfs-http-client jsonwebtoken bcryptjs

touch server.js
touch .env
node server.js

npx create-react-app frontend
cd frontend
npm install axios react-router-dom tailwindcss @web3-react/core ethers
npm start

mkdir models
touch models/User.js

mkdir routes
touch routes/authRoutes.js
node server.js

npm install crypto-js qrcode
