const mongoose = require("mongoose");

const databaseConnection = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then((res) => console.log(`Database conntected with ${res.connection.host}`))
    .catch((err) => console.log(`ERR: ${err.message}`));
}

module.exports = databaseConnection;