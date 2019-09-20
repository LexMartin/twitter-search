var Twitter = require('twitter');
var config = require('./config');
var client = new Twitter(config);
const [, , ...args] = process.argv;

if (process.argv <2) {
  console.log('Error: Faltan argumentos de búsqueda')
  process.exit(1);
} 

const params = {
  q: `${args.join(" ")} -filter:retweets`,
  count: 10,
  result_type: "recent",
  lang: "es"
};
let resultado = ""; 
let esDescartado = false;
client.get('search/tweets', params, function(err, data, response) {
  if (!err) {
    for (let i = 0; i < data.statuses.length; i++) {
      esDescartado = false;
      let tweetId = data.statuses[i].id_str;
      let user = data.statuses[i].user.screen_name;
      let tweet = data.statuses[i].text;

      // Es respuesta a alguien?
      if (data.statuses[i].in_reply_to_status_id !== null){
        esDescartado = true;
      }
      // Es Retwitteo?
      if (data.statuses[i].retweeted_status){
        esDescartado = true;
      }
      
      if (!esDescartado) {
        resultado += `https://twitter.com/${user}/status/${tweetId} \n`;
        resultado += tweet + "\n\n";
      }
    };
    //console.log(data.statuses);
    console.log(resultado);
  } else {
      console.log(err);
  }
});