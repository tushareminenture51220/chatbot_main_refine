## Getting Started

// assetPrefix: 'http://localhost/nextweb/'


First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

// Triggerr and response chat preview

- before show quick chat preview 1st show some multistpe for to admin
- ask some question about company services and etc
- and we have already save in our database common triggers and responses so user can get form them
- and after that we save this add on data to this user id and show them chatbot preview

// we have already some data save in db that is common data and there is save with true and particular data is false

//common data
const main = [
{
id: 1,
responseMsg: "Hello! How can I assist you today? 😊",
attachmentImage: null,
suggestedTrigger: [
"Tell me about your services",
"Tell me about your company",
"What do you offer",
],
triggerText: [
"Hi",
"Hello",
"Hey",
"Hey there",
"Hi there",
"Can you assist me",
"Help",
"Greetings",
],
},
{
id: 2,
responseMsg:
"You're welcome! If you have any more questions or need assistance, feel free to ask. 😄",
attachmentImage: null,
suggestedTrigger: [
"What's your name",
"How are you",
"How's it going",
"What's up",
"Who are you",
"Introduce yourself",
],
triggerText: ["Thank you", "Thanks", "Appreciate it", "Thanks a lot"],
},
{
id: 3,
responseMsg:
"I'm just a bot, but I'm here to help! What can I do for you today? 😃",
attachmentImage: null,
suggestedTrigger: [
"Tell me about your services",
"Tell me about your company",
"What do you offer",
],
triggerText: [
"I need information",
"I have a question",
"I'm looking for information",
"Can you assist me with something",
],
},
{
id: 4,
responseMsg: "Sure, I can help you with that. Please tell me what you'd like to know. 😊",
attachmentImage: null,
suggestedTrigger: [
"Tell me about your services",
"Tell me about your company",
"What do you offer",
],
triggerText: ["Tell me more", "Provide details", "Give me information"],
},
{
id: 5,
responseMsg: "Would you like to talk to a human assistant?",
attachmentImage: null,
suggestedTrigger: ["Yes", "Yes, please", "No"],
triggerText: ["I want to speak to a human", "Can I talk to a person", "I need human assistance"],
},

];
