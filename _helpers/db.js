const mongoose = require("mongoose");
const match = require("../models/match.model");
const participant = require("../models/participant.model");

//activates debug statements for troubleshooting
//mongoose.set("debug", true);
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database is connected");
    },
    (err) => {
      console.log(`Can not connect to the database${err}`);
    },
  );
mongoose.Promise = global.Promise;

async function dropDB() {
  return mongoose.connection
    .dropCollection("users")
    .catch((err) => console.log(err));
}

module.exports = {
  Match: match,
  Participant: participant,
  dropDB,
};
