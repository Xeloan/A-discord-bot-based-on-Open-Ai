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

let prompt = ``;
let promptbuffer = ``;
let transE = `The sentence below is a part of a daily conversation. Translate this sentence into English. Notice that it's colloquial. Please don't make changes to words between quotation marks. Just remain them.\n\nExample:\nInput: “勇往直前”用英语怎么翻译？\nOutput: How to translate "勇往直前" into English?\n\nInput: 你好哇！\nOutput: Hello!\n\nInput: “西尾维新”这个人你就知道吗？\nOutput: Do you know "西尾维新"?\n\nInput: `;
let transC = `The sentence below is a part of a daily conversation. Translate this sentence into Simplified Chinese(简体中文). This is a reply. Keep people's names like Elon Musk or words that have special meaning in English or coding as they are. Please don't make changes to words between quotation marks. Just remain them.\n\nExample:\nInput:  “勇往直前” can be translated into "advance bravely".\nOutput: “勇往直前” 可以被翻译为 "advance bravely"。\n\nInput: Hello there!\nOutput: 呀哈喽！\n\nInput: `;
fs.readFile('./prompt.pro','utf8', (err, data) => {
	prompt = data;
});
fs.readFile('./promptbuffer.pro','utf8',(err,data) => {
      promptbuffer = data;
});

const MAX_PROMPT_LENGTH = 1080;
var logFileName = ``;
var filePath = ``;
var [year, month, day, hour, minute, second]=[]
var formattedTime = ``;
let busy = false;
let lang;
let er;
fs.readFile('./error.json','utf8', (err, data) => {
	 er = data;
  });
fs.readFile('./lang.json','utf8', (err, data) => {
	 lang = data;
  });
console.log(`\n\n\n=============================   Xia-Gpt Chatbot <<<Ver 1.1234>>> By Xeloan Steve   =============================\n\n\n`);
client.on('ready', () => {
  if (er == 0){
     client.channels.cache.get(`${process.env.CHANNEL_ID}`).send("Channel granted");
    }
  if (er == 1){
     client.channels.cache.get(`${process.env.CHANNEL_ID}`).send("An error has appeared, bot restarted");
     fs.writeFileSync(`./error.json`, `0`);
    }
  axios.get('https://api.openai.com/v1/models/text-davinci-003', {
  headers: {
    'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
    'OpenAI-Organization': process.env.ORG
  }
})
  .then(function (response) {
    client.channels.cache.get(`${process.env.CHANNEL_ID}`).send(`Api request test succeeded. Code: ${response.status}`);
  })
  .catch(function (error) {
    client.channels.cache.get(`${process.env.CHANNEL_ID}`).send(`Api request error. Code: ${error.response.status}, please check your API KEY and Organization name. Type /restart to force the bot to reboot.`);
  });
  const currentTime = new Date().toISOString();
  console.log(`[${currentTime}] Logged in as ${client.user.tag}!`);
  [year, month, day, hour, minute, second] = currentTime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/).slice(1);
  formattedTime = `${year}_${month}_${day}_${hour}_${minute}_${second}`;
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
   [year, month, day, hour, minute, second] = currentTime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/).slice(1);
   formattedTime = `${year}_${month}_${day}_${hour}_${minute}_${second}`;
   if (message.author.bot) return;
   if (message.content.startsWith("/restart")) {
    message.reply("");
    return;
	}
   if (busy){
   message.reply(`sent too fast`);
   return;
}
   busy = true;
if (message.content.startsWith("/save")){
   let promptPath = `./prompt_history/${formattedTime}.pro`;
   fs.writeFileSync(promptPath,prompt);
   fs.writeFileSync('./promptbuffer.pro',prompt);
   promptbuffer = prompt;
   message.reply('Prompt saved.');
   busy = false;
   return;
}
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

if (message.content.startsWith("/lang 0")){
    lang = 0;
    fs.writeFileSync(`./lang.json`, `${lang}`);
    message.reply("Language set: English");
    busy = false;
    return;
}

if (message.content.startsWith("/lang 1")){
    lang = 1;
    fs.writeFileSync(`./lang.json`, `${lang}`);
    message.reply("Language set: Chinese");
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
      const file = `${text.substring(0,5)}-${randomString}.png`;
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
     busy = false;
  })();
	return;
}
	


   if (message.content.startsWith("/clear")) {
    prompt =`The following is a conversation between Xeloan and his girlfriend Xia. Xia is clever and lovely and she is also tsundere. She is very knowledgeable and knows almost everything. She is good at math and programming.\nXeloan: hello long time no see\nXia: hey hey hey, hello XXXXXXXXXXXXXXXXXeloan\nXeloan: I'm Xeloan\nXia: Sorrrrry, The tongue is knotted.\nTwo days later~\nXeloan: `
    message.reply("Prompt cleared.");
    fs.writeFileSync(`./prompt.pro`, prompt);
    busy = false;
    return;
	}
   if (message.content.startsWith("/restore")){
   prompt = promptbuffer;
   message.reply('Prompt restored.');
   fs.writeFileSync('./prompt.pro', prompt);
   busy = false;
   return;
}

   if (message.content.startsWith("/prompt")) {
    message.reply(prompt)
    message.reply(`${prompt.length}`)
    busy = false;
    return;
	}
   
   if (message.content.startsWith("/test")) {
    axios.get('https://api.openai.com/v1/models/text-davinci-003', {
  headers: {
    'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
    'OpenAI-Organization': process.env.ORG
  }
})
  .then(function (response) {
    message.reply(`Api request test succeeded. Code: ${response.status}`);
  })
  .catch(function (error) {
    message.reply(`Api request error. Code: ${error.response.status}, please check your API KEY and Organization name. Type /restart to force the bot to reboot.`);
  });
 
   (async () => {
    try{
     let test = await openai.createCompletion({
     model: "text-ada-001",
     prompt: "test",
     temperature: 0,
     max_tokens: 100,
     top_p: 1,
     frequency_penalty: 0,
     presence_penalty: 0,
});
     message.reply(`Api usability test succeeded.`)
  
     }catch(error){message.reply(`Api unsability error. Code: ${error.response.status}, please check your account. Type /restart to force the bot to reboot.`)}  

})();
    busy = false;
    return;
	}
   while (prompt.length > MAX_PROMPT_LENGTH) {
     
     const humanIndex = prompt.indexOf("Xeloan: ");
     
     const aiIndex = prompt.indexOf("Xia: ", humanIndex) + 3; 
     
     const nextMessageIndex = prompt.indexOf("Xeloan: ", aiIndex + 1);
     
     prompt = prompt.substring(0, humanIndex) + prompt.substring(nextMessageIndex, prompt.length);
   }
if (lang == 1) {
    let inputC = transE + `${message.content}\nOutput:`;
    let response;
    let response1;
    let gptResponse;
    (async () => {
     let success = false;
     let i = 0;
     while(!success){
   try{
     response = await openai.createCompletion({
     model: "text-davinci-003",
     prompt: inputC,
     temperature: 0,
     max_tokens: 2000,
     top_p: 1,
     frequency_penalty: 0,
     presence_penalty: 0,
});
     success = true;
   }catch(error){}
    i+=1;
    if (i>=3) break;
}
            i = 0;
            success = false;
            const reply = await message.reply(".................");

     		prompt += `${response.data.choices[0].text.trim()}\n`;
      while(!success){
         try{
            gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 512,
            temperature: 0.9,
            top_p: 0.4,
            presence_penalty: 1,
            frequency_penalty: 1,
		stop: ["Xeloan: ", " Xia: ", "Two days later~"],
             });
            success = true;
   }catch(error){}
    i+=1;
    if (i>=3) break;
}
            i = 0;
            success = false;
            await reply.edit(".................................");
          
            let inputE = transC + `${gptResponse.data.choices[0].text.substring(5)}\nOutput:`;
       while(!success){
         try{
            response1 = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: inputE,
            temperature: 0.5,
            max_tokens: 2000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
           });
      success = true;
   }catch(error){}
    i+=1;
    if (i>=3) break;
}
     prompt += `${gptResponse.data.choices[0].text.trim()}\n`;
     prompt += `Xeloan: `;
     await reply.delete();
     message.reply(`${response1.data.choices[0].text.trim()}\n`);
     fs.writeFileSync(`./prompt.pro`, prompt);
     busy = false;
  })();
   return;
}
   prompt += `${message.content}\n`;
  (async () => {
       let success = false;
       let j = 0;
       let gptResponse;
     while(!success){
       try{
            gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 512,
            temperature: 0.9,
            top_p: 0.4,
            presence_penalty: 1,
            frequency_penalty: 1,
		stop: ["Xeloan: ", " Xia: ", "Two days later~"],
          });
         success = true;
       }catch(error){}
      j+=1;
      if (j>=3) break;
}
        message.reply(`${gptResponse.data.choices[0].text.substring(5)}`);
        prompt += `${gptResponse.data.choices[0].text.trim()}\n`;
	  prompt += `Xeloan: `;
        fs.writeFileSync(`./prompt.pro`, prompt);
        busy = false;
    })();
        
});                
                            
client.login(process.env.BOT_TOKEN);
