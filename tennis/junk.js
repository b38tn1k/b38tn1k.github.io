
matchmakingTool = new MatchmakingTool(players);
matchmakingTool.generateSchedule();

const matches = matchmakingTool.gameSchedule;

for (let i = 0; i < matches.length; i++) {
  try {
    console.log('WEEK ' + String(i));
    console.log('MATCH ' + String(matches[i][0].matchNumber));
    console.log('CAPTAIN ' + String(matches[i][0].captains[0].firstName));
    console.log('TEAM A ' + matches[i][0].players[0].firstName + ', ' + matches[i][0].players[1].firstName);
    console.log('TEAM 1 ' + matches[i][0].players[2].firstName + ', ' + matches[i][0].players[3].firstName);
    console.log('WEEK ' + String(i));
    console.log('MATCH ' + String(matches[i][1].matchNumber));
    console.log('CAPTAIN ' + String(matches[i][1].captains[0].firstName));
    console.log('TEAM A ' + matches[i][1].players[0].firstName + ', ' + matches[i][1].players[1].firstName);
    console.log('TEAM 1 ' + matches[i][1].players[2].firstName + ', ' + matches[i][1].players[3].firstName);
  } catch (error) {
    console.log('Not Enough Players');
  }
}