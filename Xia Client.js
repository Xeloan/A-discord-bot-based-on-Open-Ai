require('dotenv').config();
const { Client, GatewayIntentBits, Discord } = require('discord.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,] });
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let prompt =`The following is a conversation with an AI friend.It's Xeloan's good friend. Its name is Xia. It is talktive,curious , creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am Xeloan's friend Xia. Nice to meet you.\nHuman: `

const MAX_PROMPT_LENGTH = 1680
var logFileName = ``;
var filePath = ``;
let busy = false;
client.on('ready', () => {
  client.channels.cache.get(`${process.env.CHANNEL_ID}`).send("Channel granted");
  const currentTime = new Date().toISOString();
  console.log(`[${currentTime}] Logged in as ${client.user.tag}!`);
  const [year, month, day, hour, minute, second] = currentTime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/).slice(1);
  const formattedTime = `${year}_${month}_${day}_${hour}_${minute}_${second}`;
  logFileName = `${formattedTime}.log`;
  filePath = `./logs/${logFileName}`;
  fs.writeFileSync(`./logs/${logFileName}`, `[${currentTime}] Logged in as ${client.user.tag}!`+`\n`);
});

client.on("messageCreate", function (message) {

if (`${message.channel.id}` !== `${process.env.CHANNEL_ID}`){

	return;

}
   
   const currentTime = new Date().toISOString();
   console.log(`[${currentTime}] ${message.author.tag}: ${message.content}`);
   fs.appendFileSync(filePath,`[${currentTime}] ${message.author.tag}: ${message.content}`+`\n`);
   if (message.author.bot) return;
   if (busy){
   message.reply(`sent too fast`);
   return;
}
   busy = true;
if (message.content.startsWith("/log")) {

     message.reply({
      files: [{
          attachment: filePath,
          name: logFileName
        }]
});
      busy = false;
	return;
}

if (message.content.startsWith("/D")) {
  (async () => {
    const text = message.content.slice(3);
    const creatingMessage = await message.reply(`Creating`);
    try { 
      const response = await openai.createImage({
        prompt: text,
        n: 1,
        size: "1024x1024",
      });
      image_url = response.data.data[0].url;

    
      const image = await axios({
        url: image_url,
        responseType: 'arraybuffer'
      });
      const randomString = crypto.randomBytes(4).toString('hex');
      const file = `${text}-${randomString}.png`;
	fs.writeFileSync(path.join('./DALLE_img', file), image.data);
	await creatingMessage.delete();
      message.reply({
        files: [{
          attachment: './DALLE_img/' + file,
          name: file
        }]
      });
    } catch (error) {
      console.error(error);
	await creatingMessage.delete();
      message.reply(`Invalid content`);
    }
  })();
      busy = false;
	return;
}
	


   if (message.content.startsWith("/clear")) {
    prompt =`The following is a conversation with an AI friend.It's Xeloan's good friend. Its name is Xia. It is talktive,curious, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am Xeloan's friend Xia. Nice to meet you.\nHuman: `
    message.reply("Prompt cleared.");
    busy = false;
    return;
	}
   if (message.content.startsWith("/prompt")) {
    message.reply(prompt)
    message.reply(`${prompt.length}`)
    busy = false;
    return;
	}
   while (prompt.length > MAX_PROMPT_LENGTH) {
     
     const humanIndex = prompt.indexOf("Human: ");
     
     const aiIndex = prompt.indexOf("AI: ", humanIndex) + 3; 
     
     const nextMessageIndex = prompt.indexOf("Human: ", aiIndex + 1);
     
     prompt = prompt.substring(0, humanIndex) + prompt.substring(nextMessageIndex, prompt.length);
   }
   prompt += `${message.content}\n`;
  (async () => {
        const gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 512,
            temperature: 1,
            top_p: 0.4,
            presence_penalty: 0.7,
            frequency_penalty: 0.7,
		stop: [" Human:", " AI:"],
          });
        message.reply(`${gptResponse.data.choices[0].text.substring(4)}`);
        prompt += `${gptResponse.data.choices[0].text.substring(0)}\n`;
	  prompt += `Human: `;
        busy = false;
    })();
});                
                            
client.login(process.env.BOT_TOKEN);
