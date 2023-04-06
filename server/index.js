const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dontenv = require("dotenv");

const app = express();
const PORT = 3001;

dontenv.config();
app.use(express.json());
app.use(cors());
app.use('/images', express.static('images'));

app.use("/users", require("./routes/users"));
app.use("/posts", require("./routes/posts"));
app.use("/auth", require("./routes/auth"));

mongoose.connect("mongodb+srv://<username>:<pw>@cluster0.0lxtuoe.mongodb.net/<db>?retryWrites=true&w=majority",
    { useNewUrlParser: true, }
);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));