const tf = require("@tensorflow/tfjs-node");

/* 
championId
spell1Id
spell2Id
item0
item1
item2
item3
item4
item5
item6
totalDamageDealt
totalDamageDealtToChampions
totalHeal
goldEarned
totalMinionsKilled
neutralMinionsKilled
champLevel
perkPrimaryStyle
perkSubStyle
*/
//keep in mind ORACLE ELIXIR DATA

const model = tf.sequential();
model.add(
  tf.layers.dense({
    units: 250,
    activation: "relu",
    inputShape: [19],
  }),
);
model.add(tf.layers.dense({ units: 175, activation: "relu" }));
model.add(tf.layers.dense({ units: 150, activation: "relu" }));
model.add(tf.layers.dense({ units: 125, activation: "relu" }));
model.add(
  tf.layers.dense({
    units: 5,
    activation: "softmax",
  }),
);

model.compile({
  optimizer: tf.train.adam(),
  loss: "sparseCategoricalCrossentropy",
  metrics: ["accuracy"],
});

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
