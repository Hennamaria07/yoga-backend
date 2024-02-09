const app = require("./app");
const dotenv = require('dotenv');
const databaseConnection = require("./db/index.js");

dotenv.config({path: "./.env"});
databaseConnection();
const port = process.env.PORT ;
app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
})