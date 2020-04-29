const tf = require("@tensorflow/tfjs");

const db = require("./_helpers/db");
const { Participant } = db;
/* 
item.championId,item.spell1Id,item.spell2Id,item.item0,item.item1,item.item2,item.item3,item.item4,item.item5,item.item6,item.totalDamageDealt,item.totalDamageDealtToChampions,item.totalHeal,item.goldEarned,item.totalMinionsKilled,item.neutralMinionsKilled,item.champLevel,item.perkPrimaryStyle,item.perkSubStyle
*/
//keep in mind ORACLE ELIXIR DATA

// Returns the string value for Baseball pitch labels
function roleFromClassNum(classNum) {
  switch (classNum) {
    case 0:
      return "midlaner";
    case 1:
      return "jungler";
    case 2:
      return "carry";
    case 3:
      return "support";
    case 4:
      return "toplaner";
    default:
      return "Unknown";
  }
}

async function runModel() {
  var data = await Participant.find();
  var test = [];
  for (let index = 0; index < 20; index++) {
    test.push(data.pop());
  }
  const trainingData = tf.tensor2d(
    data.map((item) => [
      item.championId,
      item.spell1Id,
      item.spell2Id,
      item.item0,
      item.item1,
      item.item2,
      item.item3,
      item.item4,
      item.item5,
      item.item6,
      item.totalDamageDealt,
      item.totalDamageDealtToChampions,
      item.totalHeal,
      item.goldEarned,
      item.totalMinionsKilled,
      item.neutralMinionsKilled,
      item.champLevel,
      item.perkPrimaryStyle,
      item.perkSubStyle,
    ]),
  );
  const outputData = tf.tensor2d(
    data.map((item) => [
      item.role === 0 ? 1 : 0,
      item.role === 1 ? 1 : 0,
      item.role === 2 ? 1 : 0,
      item.role === 3 ? 1 : 0,
      item.role === 4 ? 1 : 0,
    ]),
  );
  const testingData = tf.tensor2d(
    test.map((item) => [
      item.championId,
      item.spell1Id,
      item.spell2Id,
      item.item0,
      item.item1,
      item.item2,
      item.item3,
      item.item4,
      item.item5,
      item.item6,
      item.totalDamageDealt,
      item.totalDamageDealtToChampions,
      item.totalHeal,
      item.goldEarned,
      item.totalMinionsKilled,
      item.neutralMinionsKilled,
      item.champLevel,
      item.perkPrimaryStyle,
      item.perkSubStyle,
    ]),
  );
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      units: 250,
      activation: "sigmoid",
      inputShape: [19],
    }),
  );
  model.add(tf.layers.dense({ units: 175, activation: "sigmoid" }));
  model.add(tf.layers.dense({ units: 150, activation: "sigmoid" }));
  model.add(tf.layers.dense({ units: 125, activation: "sigmoid" }));
  model.add(
    tf.layers.dense({
      units: 5,
      activation: "sigmoid",
    }),
  );

  model.compile({
    optimizer: tf.train.adam(0.06),
    loss: "meanSquaredError",
  });

  const startTime = Date.now();
  model
    .fit(trainingData, outputData, { epochs: 100 })
    .then((history) => {
      console.log("done!", Date.now() - startTime);
    });
}

module.exports = {
  runModel,
};
