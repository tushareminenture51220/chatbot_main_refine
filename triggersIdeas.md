````
const data = [
   {
     heading: "General Information",
     items: [
       "What is your company all about?",
       "Tell me about your company.",
       "What do you do as an IT company?",
     ],
   },
   {
     heading: "Services",
     items: [
       "What services do you offer?",
       "Can you provide details about your services?",
       "Tell me more about your service offerings.",
     ],
   },
   {
     heading: "Contact Information",
     items: [
       "How can I contact you?",
       "What are your contact details?",
       "Provide your contact information.",
     ],
   },
   {
     heading: "Products",
     items: [
       "What products do you sell or develop?",
       "Tell me about your software products.",
     ],
   },
   {
     heading: "Client Testimonials",
     items: [
       "Do you have any client testimonials?",
       "Can you share some customer feedback?",
     ],
   },
   {
     heading: "Pricing and Quotes",
     items: ["What are your pricing options?", "How can I get a price quote?"],
   },
   {
     heading: "Partnerships",
     items: [
       "Are you open to partnerships?",
       "Can we collaborate with your company?",
     ],
   },
   {
     heading: "Career Opportunities",
     items: [
       "Do you have job openings?",
       "How can I apply for a job at your company?",
     ],
   },
   {
     heading: "Technology Stack",
     items: [
       "What technologies do you work with?",
       "Tell me about your preferred tech stack.",
     ],
   },
   {
     heading: "Company Culture",
     items: [
       "Describe your company culture.",
       "What values are important to your organization?",
     ],
   },
   {
     heading: "Case Studies",
     items: [
       "Can you share some success stories or case studies?",
       "Provide examples of your work.",
     ],
   },
   {
     heading: "Security and Compliance",
     items: [
       "How do you ensure data security?",
       "Are you compliant with industry standards?",
     ],
   },
   {
     heading: "Client Onboarding",
     items: [
       "What is the process for onboarding new clients?",
       "How can I become a client?",
     ],
   },
   {
     heading: "Support and Help",
     items: [
       "How can I get support?",
       "Do you offer customer support services?",
     ],
   },
   {
     heading: "Company News and Updates",
     items: [
       "Share the latest company news and updates.",
       "What's new at your organization?",
     ],
   },
   {
     heading: "Project Inquiries",
     items: [
       "How can I request a new project?",
       "Tell me about your project initiation process.",
     ],
   },
   {
     heading: "Partnership Opportunities",
     items: [
       "Are you open to partnerships with other IT companies?",
       "Can we collaborate on a project?",
     ],
   },
   {
     heading: "FAQs",
     items: [
       "Provide answers to frequently asked questions.",
       "Share your FAQ section.",
     ],
   },
 ];
 ```

````
```
//socket io
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credential: true,
  },
});

//store online all online user inside this map
global.onlineUsers = new Map();

//here we do if we have new connection then we store our new connection socket inside global socket
io.on("connection", (socket) => {
  global.chatSocket = socket;

  //whenever user is logged in frontend then we establish a socket connection and grab userId and socket id and we set into map by the add user event
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  //whenever send-msg socket event emited then we pass data and this data and that data have data.to and data.msg and here we check if user is online then we send msg to that user otherwise we store in database and after user come online then send
  socket.io("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });
});

```
