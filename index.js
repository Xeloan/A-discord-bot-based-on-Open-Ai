require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,] });
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let prompt =`The following is a conversation with an AI friend.It's Xeloan's good friend. Its name is Xia. It is talktive,curious , creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am Xeloan's friend Xia. Nice to meet you.\nHuman: `
//set original prompt, it's important to build a conversation environment to let the AI know what do you want to do
//Without it, for example, when you send a hello, the ai will autofill it into a "hello world" code of a computer........

const MAX_PROMPT_LENGTH = 1680  //set maximum length of the prompt

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", function (message) {
   console.log('Usercontent：', message.content);
   if (message.author.bot) return;
   // Ignore messages from other bots

if (message.content.startsWith("/D")) {   // Use the OpenAI API to generate an image based on the text after the "/D" command
    (async () => {
      try {
        const text = message.content.slice(3);
        message.reply(`Creating`);
        const response = await openai.createImage({
          prompt: text,
          n: 1,
          size: "1024x1024",
        });
        image_url = response.data.data[0].url;
        message.reply(image_url);
      } catch (error) {
        console.error(error);
        message.reply("Invalid content");
      }
    })();
    return;
  }



   if (message.content.startsWith("/clear")) {      // Reset the prompt to its original value
    prompt =`The following is a conversation with an AI friend.It's Xeloan's good friend. Its name is Xia. It is talktive,curious, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am Xeloan's friend Xia. Nice to meet you.\nHuman: `
    message.reply("Prompt cleared.");
    return;
	}
   if (message.content.startsWith("/prompt")) { // Send the current prompt to the channel and its length
    message.reply(prompt)
    message.reply(`${prompt.length}`)
    return;
	}
   while (prompt.length > MAX_PROMPT_LENGTH) {  
     
     const humanIndex = prompt.indexOf("Human: ");
     
     const aiIndex = prompt.indexOf("AI: ", humanIndex) + 3;   // Find the indexes of the next human and AI messages in the prompt
     
     const nextMessageIndex = prompt.indexOf("Human: ", aiIndex + 1);
     
     prompt = prompt.substring(0, humanIndex) + prompt.substring(nextMessageIndex, prompt.length);  // Remove the oldest messages from the prompt until it is under the maximum length, it will not remove the top description in the prompt
   }
   prompt += `${message.content}\n`;  //Add the received message to the prompt
  (async () => {   // Use the OpenAI API to generate a response to the message
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
        message.reply(`${gptResponse.data.choices[0].text.substring(4)}`);  // add the response to the prompt, which will automatically start with AI:
        prompt += `${gptResponse.data.choices[0].text.substring(0)}\n`;
	  prompt += `Human: `;  // add Human: to let the AI better understand that this is a message sent by human
    })();
});                
                            
client.login(process.env.BOT_TOKEN);
