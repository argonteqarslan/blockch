const mongoose = require("mongoose")

require('dotenv').config();

const { DB_URL } = process.env;
console.log(DB_URL)

exports.dbConnection = () => {
    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log("mongodb connected"))
        .catch((err) => {
            console.log(err.message);
            process.exit(1);
        });

}
