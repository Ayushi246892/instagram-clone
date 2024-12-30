// const express = require('express');
// const app = express()
// const port = 5000;
// const mongoose = require("mongoose");
// const dotenv = require('dotenv')
// const connectDB = require('./db/db');
// // const { mongoUrl } = require("./keys");
// const cors = require("cors");
// app.use(cors())
// require('./models/model')
// require('./models/post')
// app.use(express.json())
// app.use(require("./routes/auth"))
// app.use(require("./routes/createPost"))
// app.use(require("./routes/user"))
// // mongoose.connect(mongoUrl);
// dotenv.config();
// connectDB();

// // mongoose.connection.on("connected", () => {
// //     console.log("successfully connected to mongo")
// // })

// // mongoose.connection.on("error", () => {
// //     console.log("not connected to mongodb")
// // })


// app.listen(port, () => {
//     console.log("server is running on port" + " " + port)

// })

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./db/db');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Import models
require('./models/model');
require('./models/post');

// Import routes
app.use(require('./routes/auth'));
app.use(require('./routes/createPost'));
app.use(require('./routes/user'));

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
