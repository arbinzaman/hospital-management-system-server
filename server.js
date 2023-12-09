const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const port = process.env.PORT || 5000
mongoose.set('strictQuery', false);
const app = require("./app");

mongoose.connect(process.env.DB_LOCAL).then(()=>{
    console.log("Database is connected")
})

app.listen(port, () => {
    console.log(`App is running on port ${port}`)
})