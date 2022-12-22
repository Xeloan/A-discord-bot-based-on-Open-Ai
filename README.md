# Description
This is a multifunctional discord bot based on Open Ai that is able to chat and create images according to your description.The chat it makes is based on davinci-text-3 and the image is created from DALL-E.
Actually, there have already existed some kinds of bots like that but they contain some bugs or flaws which might prevent the bot from working properly.

PS: Indeed, I'm really a green hand of promgraming. It was not until I ran across Open Ai and fell in love with it that I step my first pace into programming. When I tried to build the bot based on Open Ai api, I found myself knew nothing about it so I just googled tuitions and attempted to simply copy the code. However, I felt at a loss when being faced with error reports which was all gobbledegook to me. As a result, I tried to understand the code myself. Luckily, with the help of Chat GPT, I soon grasped some basic elements so I was able to make comparisons among the codes found on the Internet. By trial and error, I solved all the problems I met and additonally, I made some improvement on them. Consequently, the bot was born.
# Function and Features
The chatting function is based on Open Ai's "text-completion". You can find the description on the main website: https://beta.openai.com/docs/guides/completion
When you send a message (only works in discord channel not direct message), the bot will combine the message you've sent into a prompt which to Open Ai api and then send you the response generated through Open Ai api. After that the response will also be added to the prompt along with the next message you send and the send the whole prompt again, thus resulting in a fluent chat where the bot can understand contexts. After the prompt reach a certain amount, it will be automatically cut the oldest messages to prevent the large costs. (The huger your prompt is, the higher cost the completion will make.) What's more, I add two commands in it. /clear will clear all the prompt. (you can regard it as clear chat history) /prompt will show the current prompt and the length of it to help you make changes.

The image generating is much easier. Just type "/D descriptions" and the message will be sent to DALL-E. Then the bot will send you the link of the picture generated.
If the description contains sensitive contents like "sexy", whicb will cause request error, the bot will send you "Invalid content" instead. (This function is important or the bot will break down if yoy send sensitive contents)
# Preparation
I suggest viewing the tuition: https://www.twilio.com/blog/build-gpt-3-discord-chatbot-node-js. The previous steps are right but in the code he made a mistake, can you find it?
# The last thing
You can just copy my code if you are lazy. I think there is no bug in it and it will permanently work unless there is a power or Internet outage.
