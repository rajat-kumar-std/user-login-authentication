const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

function connectToDB() {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log('Connected to DB'))
    .catch((err) => console.log('Could not connect to DB: ', err.message));
}

module.exports = connectToDB;
