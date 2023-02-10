# Description
This is a multifunctional discord bot based on Open Ai that is able to chat and create images according to your description.The chat it makes is based on davinci-text-3 and the image is created from DALL-E.
Actually, there have already existed some kinds of bots recently developed by someone more professional than me, but I'd like to pace my way and make distinctive features.

PS: Indeed, I'm really a green hand of promgraming. It was not until I ran across Open Ai and fell in love with it that I step my first pace into programming. When I tried to build the bot based on Open Ai api, I found myself knew nothing about it so I just googled tuitions and attempted to simply copy the code. However, I felt at a loss when being faced with error reports which was all gobbledegook to me. As a result, I tried to understand the code myself. Luckily, with the help of Chat GPT, I soon grasped some basic elements so I was able to make comparisons among the codes found on the Internet. By trial and error, I solved all the problems I met and additonally, I made some improvement on them. Consequently, the bot was born.
# Function and Features
The chatting function is based on Open Ai's "text-completion". You can find the description on the main website: https://beta.openai.com/docs/guides/completion
When you send a message (only works in discord channel not direct message), the bot will combine the message you've sent into a prompt which to Open Ai api and then send you the response generated through Open Ai api. After that the response will also be added to the prompt along with the next message you send and the send the whole prompt again, thus resulting in a fluent chat where the bot can understand contexts. After the prompt reach a certain amount, it will be automatically cut the oldest messages to prevent the large costs. (The huger your prompt is, the higher cost the completion will make.) What's more, I add two commands in it. /clear will clear all the prompt. (you can regard it as clear chat history) /prompt will show the current prompt and the length of it to help you make changes. Now you can use /save and /restore to save and restore your prompt.

At the ver1.1234, the bot can handle other languages with lower costs of tokens, for details please view the updates.

At the ver1.12345, the bot can write code in the code block for you!

The image generating is much easier. Just type "/D descriptions" and the message will be sent to DALL-E. Then the bot will send you the link of the picture generated.
If the description contains sensitive contents like "sexy", which will cause request error, the bot will send you "Invalid content" instead. (This function is important or the bot will break down if you send sensitive contents) Now the bot will send the image instead of url which will expire in hours.

The bot generates chat logs in the folder logs named by the current UTC time. Use /log to let the bot show you the current log.

More features please see the Recent Updates ↓↓↓
## Recent Updates
V1.12345: I optimize the language translation for Chinese. I also adapt fhe prompt to send a code block when you ask the bot to write a code. Please watch the examples below.

!!!!!!some bug fixed in the Ver1.1234, please update the bot program. View details in the release: https://github.com/Xeloan/A-discord-bot-based-on-Open-Ai/releases/tag/V1.1234

V1.1234: This is a major update. First, the stability has been improved a lot. I use windows bat file(now is converted to an exe file) to start Xia_Client.js, and when any error appears that causes the program to break down, it will restart automatically instead of just breaking down(You can also restart it by typing /restart). So feel free to let the bot run in your computer and leave it open at home when going out. Next, I add a "/save" command. This will save current prompt into the promptbuffer.pro and type "/restore" to restore the prompt to that one if you have mistyped something. The prompt will also be saved into the prompt_history folder for you to check. If you just turn off the bot or restart it, the prompt is also stored in the prompt.pro so the prompt will be recovered automatically when the bot is restarted. Then I add a "/test" command to test whether the api works alright. The bot will automatically check when started. Finally, I add a language set command. In most conditions, when expressing the same meaning, languages like Chinese and Japanese will much more tokens than English (sometimes more than 2x) so when the prompt becomes longer, the tokens consumed is very considerable. As a result, I come up with an idea. When I type something like “你好”(Chinese). The bot will first use the API to translate the sentence into “hello” and add it to the prompt and then generate the response. After that, the bot then translate the response into Chinese and send it to you. There are two commands. “/lang 0” means English mode, also the common mode (you can chat with the bot in other languages but as shown before, you may spend lot’s of tokens). “/lang 1”means Chinese mode. You can chat in Chinese at lower costs. (More languages will be added in the next version.)
 

V1.00012: New small functions and performance improvement. I add a log function to it which can automatically write current chat history with the bot in to a log file named by the current UTC time in the logs folder(new command: /log which let the bot send you the current log). I also make the bot delete the "Creating" after sending the image. (That seems better) Finally, the bot now will ignore messages sent too quickly in order not to get banned by open AI.(Open ai api will report error if I send another request before it answer my previous request.)

V1.00001: A very small update. I add a channel verification to make the bot only work in one certain channel. (I haven't thought of a way to use just one bot in multiple channels) What's more, I improve the /D image generation to make an image cache in the DALLE_img folder and send the image itself instead of just a url, which will expire in hours.
# Command list
/prompt : send the prompt

/clear: clear the prompt

/save: save the prompt

/restore: restore the prompt

/log: send the log

/test: test whether Open AI API works alright

/restart: restart the bot

/D <Description>: create an image using DALL-E based on the description
 
/lang 0: language set English (default)
 
/lang 1: language set Chinese
# Preparation
After downloading and decompressing the Xia Client in the releases and installing nodejs on your computer
First build a bot on discord:  (I just partly copy that written by Kav-K)
- Create a new Bot on Discord Developer Portal: https://discord.com/developers/applications
    - Applications -> New Application
- Generate Token of the bot
    - Select App (Bot) -> Bot -> Reset Token
- Toogle PRESENCE INTENT:
    - Select App (Bot) -> Bot -> PRESENCE INTENT, SERVER MEMBERS INTENT, MESSAGES INTENT, (basically turn on all intents)
- Add Bot the the server.
    - Select App (Bot) -> OAuth2 -> URL Generator -> Select Scope: Bot
    - Bot Permissions will appear, select the administrator permissions
    - Copy the link generated below and paste it on the browser
    - On add to server select the desired server to add the bot
Next get the ID of the channel you've added the bot in: you can just open the channel and check the link (like https://discord.com/channels/974519864045756446/1047566067888820274 the 1047566067888820274 is the channel ID)
Then generate an Open AI Api key: https://beta.openai.com/account/api-keys and get your organization ID in https://platform.openai.com/account/org-settings
Finally paste the token of the bot, Open AI Api, organization ID and the channel ID into the .env in the file you've downloaded.
Open the Xia Client.exe(not the xxx.js), you will see login in the log and the bot send "Channel granted" in your channel(remember just one channel).
# The last thing
You can just copy my code if you are lazy. I think there is no bug in it and it will permanently work unless there is a power or Internet outage. You can get the already-made client in the releases.

The module I have used is dotenv discord.js openai fs path axios crypto. You can use npm install if you need them.

Please notice: for users in areas where you have to use VPN or proxy to connect to the discord server, make sure your proxy can overtake all the network traffic like turning on the TUN mode in Clash For Windows. Nodejs usually skip system proxy.
# Examples
![image](https://user-images.githubusercontent.com/105624127/217454844-8b57e0dc-94ad-44bd-977a-ff7fbdbad034.png)
![Screenshot 2022-12-28 085115](https://user-images.githubusercontent.com/105624127/209741504-52921352-f66f-4f27-916f-4052181efed3.png)
![Screenshot 2022-12-28 085156](https://user-images.githubusercontent.com/105624127/209741519-b30f808a-2b82-4b01-a1f4-b88a75b98ed2.png)
![Screenshot 2022-12-28 085518](https://user-images.githubusercontent.com/105624127/209741547-c64a6142-e7b1-4828-a64e-0a8fdfd2598f.png)
![Screenshot 2022-12-28 085549](https://user-images.githubusercontent.com/105624127/209741568-d10366d5-e4bd-43e0-8d19-03a4540e64a9.png)
![image](https://user-images.githubusercontent.com/105624127/209050419-6bd62689-367c-423d-9fcd-fb77b1fab145.png)
![image](https://user-images.githubusercontent.com/105624127/209050560-86df37f6-2596-4e41-ab1d-202476cebb72.png)
![image](https://user-images.githubusercontent.com/105624127/217455007-1eb13f40-27f5-4a5d-be59-d39dd37ff5a5.png)
![image](https://user-images.githubusercontent.com/105624127/217455187-d55aa320-cc6a-417b-b3d4-4681c2881cb5.png)
![image](https://user-images.githubusercontent.com/105624127/217456861-bc0e4a74-af5c-4d6d-8db3-b4a63391d86b.png)
![image](https://user-images.githubusercontent.com/105624127/217455330-1e546f2a-68bc-4b99-ae1a-f33bb33659da.png)
![image](https://user-images.githubusercontent.com/105624127/217455548-1bcc493a-b5c6-4600-b0c2-01a7feee986d.png)
![image](https://user-images.githubusercontent.com/105624127/217458931-df534a20-1e2d-4dc7-9a39-6d236eed61dd.png)
![Screenshot 2023-02-10 224950](https://user-images.githubusercontent.com/105624127/218122818-61a79f9f-7fcc-441c-ab37-dcf92d0f8768.png)
![Screenshot 2023-02-10 225015](https://user-images.githubusercontent.com/105624127/218122851-e91f9cdd-befb-41d9-ace4-fa793506302e.png)
