require("dotenv").config();
const matchService = require("./_helpers/match.service");
const modelCreation = require("./model-creation");

// Gather the Matchdata
//matchService.allMatches("data.csv");

//make the model
modelCreation.runModel();

//modelCreation.predict();
