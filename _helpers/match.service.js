// apiService uses a package to call the official riot api
const apiService = require("../_helpers/api.service");
const ErrorHelper = require("../_helpers/error-helper");
const fs = require("fs");
const csv = require("csv-parser");
//instantiating the database: look at the database file for more info
const db = require("../_helpers/db");
// loads the Models
const { Match, Participant } = db;

async function saveParticipants(matches, matchList) {
  var participants = [];
  matches.forEach((match) => {
    var roleData = matchList.find(
      (game) => game.gameId === match.gameId.toString(),
    );
    match.participants.forEach((element) => {
      let participant = new Participant();
      //summonerId
      let result = match.participantIdentities.find(
        (player) => player.participantId === element.participantId,
      );
      participant.summonerId = result.player.summonerId;

      participant.role = roleData[element.participantId.toString()];

      participant.matchId = match.gameId;
      participant.championId = element.championId;
      participant.spell1Id = element.spell1Id;
      participant.spell2Id = element.spell2Id;
      participant.teamId = element.teamId;
      participant.win = element.stats.win;

      participant.item0 = element.stats.item0;
      participant.item1 = element.stats.item1;
      participant.item2 = element.stats.item2;
      participant.item3 = element.stats.item3;
      participant.item4 = element.stats.item4;
      participant.item5 = element.stats.item5;
      participant.item6 = element.stats.item6;
      participant.kills = element.stats.kills;
      participant.deaths = element.stats.deaths;
      participant.assists = element.stats.assists;
      participant.largestKillingSpree =
        element.stats.largestKillingSpree;
      participant.largestMultiKill = element.stats.largestMultiKill;
      participant.killingSprees = element.stats.killingSprees;
      participant.longestTimeSpentLiving =
        element.stats.longestTimeSpentLiving;
      participant.doubleKills = element.stats.doubleKills;
      participant.tripleKills = element.stats.tripleKills;
      participant.quadraKills = element.stats.quadraKills;
      participant.pentaKills = element.stats.pentaKills;
      participant.unrealKills = element.stats.unrealKills;
      participant.totalDamageDealt = element.stats.totalDamageDealt;
      participant.magicDamageDealt = element.stats.magicDamageDealt;
      participant.physicalDamageDealt =
        element.stats.physicalDamageDealt;
      participant.trueDamageDealt = element.stats.trueDamageDealt;
      participant.largestCriticalStrike =
        element.stats.largestCriticalStrike;
      participant.totalDamageDealtToChampions =
        element.stats.totalDamageDealtToChampions;
      participant.magicDamageDealtToChampions =
        element.stats.magicDamageDealtToChampions;
      participant.physicalDamageDealtToChampions =
        element.stats.physicalDamageDealtToChampions;
      participant.trueDamageDealtToChampions =
        element.stats.trueDamageDealtToChampions;
      participant.totalHeal = element.stats.totalHeal;
      participant.totalUnitsHealed = element.stats.totalUnitsHealed;
      participant.damageSelfMitigated =
        element.stats.damageSelfMitigated;
      participant.damageDealtToObjectives =
        element.stats.damageDealtToObjectives;
      participant.damageDealtToTurrets =
        element.stats.damageDealtToTurrets;
      participant.visionScore = element.stats.visionScore;
      participant.timeCCingOthers = element.stats.timeCCingOthers;
      participant.totalDamageTaken = element.stats.totalDamageTaken;
      participant.magicalDamageTaken =
        element.stats.magicalDamageTaken;
      participant.physicalDamageTaken =
        element.stats.physicalDamageTaken;
      participant.trueDamageTaken = element.stats.trueDamageTaken;
      participant.goldEarned = element.stats.goldEarned;
      participant.goldSpent = element.stats.goldSpent;
      participant.turretKills = element.stats.turretKills;
      participant.inhibitorKills = element.stats.inhibitorKills;
      participant.totalMinionsKilled =
        element.stats.totalMinionsKilled;
      participant.neutralMinionsKilled =
        element.stats.neutralMinionsKilled;
      participant.neutralMinionsKilledTeamJungle =
        element.stats.neutralMinionsKilledTeamJungle;
      participant.neutralMinionsKilledEnemyJungle =
        element.stats.neutralMinionsKilledEnemyJungle;
      participant.totalTimeCrowdControlDealt =
        element.stats.totalTimeCrowdControlDealt;
      participant.champLevel = element.stats.champLevel;
      participant.visionWardsBoughtInGame =
        element.stats.visionWardsBoughtInGame;
      participant.sightWardsBoughtInGame =
        element.stats.sightWardsBoughtInGame;
      participant.wardsPlaced = element.stats.wardsPlaced;
      participant.wardsKilled = element.stats.wardsKilled;
      participant.firstBloodKill = element.stats.firstBloodKill;
      participant.firstBloodAssist = element.stats.firstBloodAssist;
      participant.firstTowerKill = element.stats.firstTowerKill;
      participant.firstTowerAssist = element.stats.firstTowerAssist;
      participant.firstInhibitorKill =
        element.stats.firstInhibitorKill;
      participant.firstInhibitorAssist =
        element.stats.firstInhibitorAssist;
      participant.perk0 = element.stats.perk0;
      participant.perk1 = element.stats.perk1;
      participant.perk2 = element.stats.perk2;
      participant.perk3 = element.stats.perk3;
      participant.perk4 = element.stats.perk4;
      participant.perk5 = element.stats.perk5;
      participant.perkPrimaryStyle = element.stats.perkPrimaryStyle;
      participant.perkSubStyle = element.stats.perkSubStyle;
      participant.statPerk0 = element.stats.statPerk0;
      participant.statPerk1 = element.stats.statPerk1;
      participant.statPerk2 = element.stats.statPerk2;
    });
  });
}

async function saveMatches(matchList) {
  console.log(matchList.length + "                 SaveMatches");
  var save = [];
  var getMatches = matchList.map((tempor) => {
    return apiService.match(tempor.gameId).catch((err) => {
      console.log(err);
    });
  });
  var matches = await Promise.all(getMatches);

  saveParticipants(matches, matchList);

  matches.forEach((element) => {
    let match = new Match();
    match.matchId = element.gameId;
    match.serverId = element.platformId;
    match.type = element.gameType;
    match.mode = element.gameMode;
    match.mapId = element.mapId;
    match.duration = element.gameDuration;
    match.matchDate = new Date(element.gameCreation);
    // patch
    let tempPatch = element.gameVersion.split(".");
    match.patch = tempPatch[0] + "." + tempPatch[1];

    // participants
    element.participantIdentities.forEach((element1) => {
      match.participants.push(element1.player.summonerId);
    });
    //teams
    element.teams.forEach((element2) => {
      let tempwin;
      if (element2.win === "Win") {
        tempwin = true;
      } else {
        tempwin = false;
      }
      let data = {
        teamId: element2.teamId,
        win: tempwin,
        firstBlood: element2.firstBlood,
        firstTower: element2.firstTower,
        firstInhibitor: element2.firstInhibitor,
        firstBaron: element2.firstBaron,
        firstDragon: element2.firstDragon,
        firstRiftHerald: element2.firstRiftHerald,
        towerKills: element2.towerKills,
        inhibitorKills: element2.inhibitorKills,
        baronKills: element2.baronKills,
        dragonKills: element2.dragonKills,
        vilemawKills: element2.vilemawKills,
        riftHeraldKills: element2.riftHeraldKills,
        bans: [],
      };

      element2.bans.forEach((element3) => {
        data.bans.push(element3);
      });
      match.teams.push(data);
    });
    save.push(match);
  });
  //Match.insertMany(save);
}

async function allMatches() {
  var matchList = [];
  fs.createReadStream("data.csv")
    .pipe(csv())
    .on("data", (row) => {
      matchList.push(row);
    })
    .on("end", () => {
      for (
        let index = 0;
        index < matchList.length;
        index = index + 10
      ) {
        let temp = [];
        temp = matchList.slice(index, index + 10);
        saveMatches(temp);
      }

      console.log("Processing " + matchList.length + " Matche(s).");
    });
}

module.exports = {
  allMatches,
};
