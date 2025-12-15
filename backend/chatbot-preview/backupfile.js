let hashedId = "";
const host_URL = `http://localhost:8080`;
// https://embot-pop2.onrender.com

//custome dehash function for UserID deshash or decode
function customDehash(hash, secret) {
  const key = new TextEncoder().encode(secret);
  const hashArray = new Uint8Array(
    atob(hash)
      .split("")
      .map((char) => char.charCodeAt(0))
  );
  const result = [];

  for (let i = 0; i < hashArray.length; i++) {
    result.push(hashArray[i] ^ key[i % key.length]);
  }

  return new TextDecoder().decode(new Uint8Array(result));
}

//gloabl variable
let Auth = false;
const currentUrl = "";
const parts = currentUrl.split("/");
const id = parts[parts.length - 1];
const userId = customDehash(hashedId, "EMReact");
let isUserRegistered = false;
let wrongEmailCount = 0;
let correctEmailCount = 0;
let assiWaitingInterval;
var widget_user_email = localStorage.getItem("widget_user_email");

// console.log("userId", userId);

let alertText = "loading";

//defulalts triggers and response for common texts
let responseDataBOT = [
  {
    id: 1,

    responseMsg: "Hello 👋 how can i assist you?",
    attachmentFile: "",
    multipleRes: false,
    suggestedTrigger: [
      "Tell me about your services?",
      "Tell me about your company?",
      "Would you like us to contact you?",
    ],
    triggerText: [
      "Hi",
      "Hello",
      "hi there",
      "hey",
      "hey there",
      "Can you assist me?",
      "Need help",
    ],
  },
  {
    id: 3,
    responseMsg: "Sure thing, what's your email ID?",
    attachmentFile: "",
    multipleRes: false,
    suggestedTrigger: [],
    triggerText: ["Yes, Please connect"],
  },
  {
    id: 4,
    responseMsg:
      "Got it! 😊 How can I assist you today? Feel free to ask me anything.",
    attachmentFile: "",
    multipleRes: false,
    suggestedTrigger: [
      "Tell me about your services?",
      "Tell me about your company?",
    ],
    triggerText: ["Opt out of email, chat with the bot."],
  },
  {
    id: 5,
    responseMsg: "Thank you for chatting with us, Have a wonderful day!",
    attachmentFile: "",
    multipleRes: false,
    suggestedTrigger: [
      "Tell me about your services?",
      "Tell me about your company?",
    ],
    triggerText: ["end this conversation"],
  },
  {
    id: 6,
    responseMsg:
      "You're welcome! If you have any more questions or need further assistance, feel free to ask. We're here to help!",
    triggerText: [
      "Thank you",
      "Thanks for the information!",
      "thanks",
      "thankyou",
    ],
    multipleRes: false,
  },
  {
    id: 10,
    responseMsg: "Okay!",
    attachmentFile: "",
    suggestedTrigger: [
      "Tell me about your services?",
      "Tell me about your company?",
    ],
    triggerText: ["Not Yet", "No"],
    multipleRes: false,
  },
  {
    id: 11,
    responseMsg: "👍",
    triggerText: ["okay", "yes", "hmn"],
    multipleRes: false,
  },
  {
    id: 1560,
    responseMsg:
      "Thank you for your interest! Please fill out the form below and we'll get back to you shortly. 📝",
    triggerText: ["Quick Enquiry"],
    multipleRes: false,
  },
  {
    id: 12,
    responseMsg: "⤵",
    triggerText: [
      "Would you like to connect with us?",
      "Would you like us to contact you?",
    ],
    suggestedTrigger: ["Yes, Please connect", "Not Yet"],
    multipleRes: false,
  },
  {
    id: 13,
    responseMsg: "Would you like us to contact you?",
    attachmentFile: "",
    multipleRes: false,
    suggestedTrigger: ["Yes, Please connect", "Not Yet"],
    triggerText: [
      "chat",
      "live chat",
      "live",
      "chat with assistant",
      "assistant",
      "contact",
      "want to connect with person",
      "want to connect live assistant",
      "Want to connect with us?",
      "Live support",
      "Get assistance",
      "Live help",
      "Alternatively, you can reach out to us via live chat.",
      "Need help? Chat",
    ],
  },
];

// this is for adding chatting data
let mainChatData = [];

// for getting initals msgs
const getInitialMsg = async (userId, botId) => {
  fetch(`${host_URL}/preview/get-data/${userId}`, {
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      // console.log("res", res.data);
      res.data.forEach((item) => {
        if (item?.initialResponse == 1) {
          mainChatData.unshift(item);
        } else if (item?.initialResponse == 2) {
          mainChatData.splice(1, 0, item);
        } else if (item?.initialResponse == 3) {
          mainChatData.splice(2, 0, item);
        }
      });
      chattingData();
    })
    .catch((e) => {
      console.log(e);
    });
};

if (userId) {
  const user__id = localStorage.getItem("widget_user_id");
  if (mainChatData?.length == 0) {
    getInitialMsg(userId, user__id);
  }
  if (user__id) {
    const payload = { from: user__id };
    setTimeout(() => {
      getMsg(payload);
    }, 1000);

    setTimeout(() => {
      getParticularUser(user__id);
      socket.emit("addUser", user__id);
    }, 4000);
  }
}

const getAdminData = async (userId) => {
  try {
    let res = await fetch(`${host_URL}/auth/get-widegt-admin-data/${userId}`);
    let data = await res.json();
    setTimeout(() => {
      localStorage.setItem("adminData", JSON.stringify(data.data));
      document.querySelector(
        ".chatbot-container .chat-interface .header"
      ).style.background = data?.data?.theme;

      const spans = document.querySelectorAll(
        ".chatbot-container .chat-interface .chat-box .trigger span"
      );
      spans.forEach((span) => {
        span.style.background = data?.data?.theme;
        span.style.color = "white";
      });
      const resIconMain = document.querySelectorAll(
        ".chatbot-container .chat-interface .chat-box .response .sbfbt2SpecialBot"
      );
      resIconMain.forEach((span) => {
        span.style.background = data?.data?.theme;
      });
      document.querySelector(
        ".chatbot-container .submit-btn"
      ).style.background = data?.data?.theme;
      document.querySelector(
        ".chatbot-container .chatbot-icon"
      ).style.background = data?.data?.theme;
    }, 100);
  } catch (e) {
    console.log(e);
  }
};

if (userId) {
  setTimeout(() => {
    getAdminData(userId);
  }, 1000);
}

const getChatBotData = async (userId) => {
  // console.log(userId, id);
  fetch(`${host_URL}/preview/get-data/${userId}`, {
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      // console.log(res);
      if (res.data) {
        responseDataBOT = [...responseDataBOT, ...res.data];
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

if (userId) {
  getChatBotData(userId);
}

//loading userfull css
function loadCSSFile() {
  // var currentDomain = window.location.origin;
  // "./styles.css";
  //https://chatbot-widgets-js.vercel.app/styles.css
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "https://chatbot-widgets-js.vercel.app/test.css";
  document.head.appendChild(link);
}

//for loading socket and related scripts
function loadScriptFile() {
  let script = document.createElement("script");
  script.src = "https://kit.fontawesome.com/4f2af7deb6.js";
  script.type = "text/javascript";
  document.head.appendChild(script);
}

function loadScriptFileSocket() {
  let script = document.createElement("script");
  script.src = "https://cdn.socket.io/4.5.4/socket.io.min.js";
  script.type = "text/javascript";
  document.head.appendChild(script);
}

loadCSSFile();
loadScriptFile();
//socket io
loadScriptFileSocket();

// here we connect socket
var socket;
setTimeout(() => {
  socket = io(`${host_URL}`);
  socket.on("connect", () => {
    console.log("connected");
  });
  // localStorage.getItem("widget_user_id");
}, 1000);

// in this object we store arrival msg
let arrivalMsg = {};

// Function to check for changes in arrivalMsg and update mainChatData
function handleEffect() {
  if (arrivalMsg) {
    //console.log("arrivalMsg", arrivalMsg);
    mainChatData.push({
      responseMsg: arrivalMsg.message,
      attachmentFile: arrivalMsg.attachmentFile,
      assiMsgData: arrivalMsg?.assiMsgData,
    });
    chattingData();
  }
}

// Function to set the arrivalMsg and trigger the effect
function setArrivalMsg(newArrivalMsg) {
  if (arrivalMsg.message !== newArrivalMsg.message) {
    arrivalMsg = newArrivalMsg;
    setTimeout(() => {
      handleEffect();
    }, 1000);
  }
}

// Function to simulate listening to the "msg-receive" event
function simulateSocketListener() {
  socket.on("msg-receive", (msg) => {
    //console.log(msg, "arrival c");
    setArrivalMsg(msg);
  });
  chattingData();
}
//append Data
const appendData = () => {
  let chatbotContainer = document.createElement("div");
  chatbotContainer.className = "chatbot-container";

  let ChatBotIconDiv = document.createElement("div");
  ChatBotIconDiv.className = "ChatBotIconDiv";
  let ChatBotIconText = document.createElement("div");
  ChatBotIconText.innerText = "Hi there 👋";
  ChatBotIconText.className = "ChatBotIconText";
  let chatbotIcon = document.createElement("div");
  chatbotIcon.className = "chatbot-icon animate-fade-right ripple-effect";
  chatbotIcon.style.zIndex = "999999999";
  let chatbotIconSymbol = document.createElement("div");
  chatbotIconSymbol.className = "icon-main-embot";
  chatbotIconSymbol.id = "chatbotIconSymbol";
  chatbotIconSymbol.innerHTML = `<svg class="roboIconSvgMain animate-fade-down" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve"><g transform="matrix(1,0,0,1,0,0)"><path d="M467 151.06h-31.421C408.855 87.606 350.01 41.493 282.265 32.686c-67.134-8.95-133.096 16.89-176.25 68.906-12.686 15.293-22.749 31.919-30.117 49.468H45c-24.814 0-45 20.186-45 45v60c0 24.814 20.186 45 45 45h61.601l-6.445-19.673c-18.765-57.305-8.203-115.855 28.96-160.635 36.519-44.019 92.285-65.801 149.253-58.33 60.247 7.848 112.542 50.455 133.262 108.574l.126.337a129.933 129.933 0 0 1 7.031 27.393c4.497 28.052 1.934 56.484-7.397 82.222l-.066.179C388.164 346.886 325.87 391.06 256.293 391.06c-24.976 0-45.293 20.186-45.293 45s20.186 45 45 45 45-20.186 45-45v-20.23c59.894-14.236 110.202-56.693 134.383-114.771H467c24.814 0 45-20.186 45-45v-60c0-24.814-20.186-44.999-45-44.999z" fill="#ffffff" opacity="1" data-original="#000000" class=""></path><path d="M121 331.06v30h135c74.443 0 135-60.557 135-135s-60.557-135-135-135-135 60.557-135 135a134.921 134.921 0 0 0 28.828 83.394C146.21 322.095 134.667 331.06 121 331.06zm180-120h30v30h-30zm-60 0h30v30h-30zm-60 0h30v30h-30z" fill="#ffffff" opacity="1" data-original="#000000" class=""></path></g></svg>`;
  chatbotIcon.appendChild(chatbotIconSymbol);
  ChatBotIconDiv.append(ChatBotIconText, chatbotIcon);

  let chatInterface = document.createElement("div");
  chatInterface.className = "chat-interface animate-fade-right";
  chatInterface.id = "chat-interface";
  let chatInterfaceInnerDiv = document.createElement("div");
  chatInterfaceInnerDiv.className = "chatInterfaceinnerDiv";

  //Chatbot Header
  let adminData = localStorage.getItem("adminData");
  adminData = JSON.parse(adminData);

  //console.log(adminData);
  let chatInterfaceHeader = document.createElement("div");
  chatInterfaceHeader.className = "header";
  let Logo = document.createElement("img");
  Logo.src =
    "https://chatbot-eta-ten-41.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FembotLogo.e7ce9467.png&w=128&q=75";
  Logo.alt = "logo";
  Logo.className = "logo";

  chatInterfaceHeader.appendChild(Logo);

  let alertDiv = document.createElement("div");
  alertDiv.className = "alertDiv fade-down";
  alertDiv.style.display = "none";
  alertDiv.id = "alertDivId";
  let alertInnerDiv = document.createElement("div");
  alertInnerDiv.className = "alertInnerDiv";
  let alertIcon = document.createElement("div");
  alertIcon.className = "spinner-for-alertEMBOT";
  alertIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><g><rect width="2" height="5" x="11" y="1" fill="black" opacity="0.14"/><rect width="2" height="5" x="11" y="1" fill="black" opacity="0.29" transform="rotate(30 12 12)"/><rect width="2" height="5" x="11" y="1" fill="black" opacity="0.43" transform="rotate(60 12 12)"/><rect width="2" height="5" x="11" y="1" fill="black" opacity="0.57" transform="rotate(90 12 12)"/><rect width="2" height="5" x="11" y="1" fill="black" opacity="0.71" transform="rotate(120 12 12)"/><rect width="2" height="5" x="11" y="1" fill="black" opacity="0.86" transform="rotate(150 12 12)"/><rect width="2" height="5" x="11" y="1" fill="black" transform="rotate(180 12 12)"/><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"/></g></svg>`;
  alertIcon.id = "alertIcon";

  let alertTextHedding = document.createElement("h4");
  alertTextHedding.className = "alertTextHedding";
  alertTextHedding.id = "alertTextHedding";
  alertTextHedding.innerHTML = alertText;
  alertInnerDiv.append(alertIcon, alertTextHedding);
  alertDiv.appendChild(alertInnerDiv);
  //Chatbot Chatting Interface
  let ChattingInterface = document.createElement("div");
  ChattingInterface.className = "chat-box";
  ChattingInterface.innerHTML = `   
<div class="chat" id="chatting-main"></div>
<hr>
<div class="chat-form" >
  <form class="form" id="sendMsgForm">
      <div class="chat-input">
          <input type="text" name="bot" id="triggerInput" placeholder="Type your message here.." required>
      </div>
      <div >
          <button type="submit" id="handleSubmit" class="submit-btn submitfromBtnpiy">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="white" fill-rule="evenodd" d="M3.291 3.309a.75.75 0 0 0-.976.996l3.093 6.945H13a.75.75 0 0 1 0 1.5H5.408l-3.093 6.945a.75.75 0 0 0 .976.996l19-8a.75.75 0 0 0 0-1.382z" clip-rule="evenodd"/></svg>
          </button>
      </div>
      <br>
      <div class="EMPoweredByText">
      <span>POWERED BY</span>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 100 100" style="enable-background:new 0 0 512 512;width: 22px;height: auto;fill: #3F88F6;margin: 0px 2px;padding: 0px 1px;" xml:space="preserve" class=""><g><linearGradient id="a" x1="63.33" x2="63.33" y1="32.02" y2="85" gradientUnits="userSpaceOnUse" style="
      fill: #3F88F6;
  "><stop offset="0" stop-color="#27d7ff"></stop><stop offset=".04" stop-color="#29d2ff"></stop><stop offset=".44" stop-color="#3db3ff"></stop><stop offset=".77" stop-color="#49a0ff"></stop><stop offset="1" stop-color="#4e9aff"></stop></linearGradient><linearGradient xlink:href="#a" id="b" x1="36.75" x2="36.75" y1="16.52" y2="69.5"></linearGradient><path fill="url(#a)" d="M51.44 64.41H34.72c.98 6.77 6.8 12 13.84 12h25.12l6.19 6.03c.29.28.66.43 1.05.43.2 0 .39-.04.58-.12.56-.23.92-.78.92-1.38v-5.71c5.66-1.91 9.52-7.2 9.52-13.25V46.63c0-7.72-6.28-14-14-14h-9v14.28c0 9.65-7.85 17.5-17.5 17.5z" opacity="1" data-original="url(#a)" style="
      fill: #3F88F6;
  "></path><path fill="url(#b)" d="M8.06 31.13v15.78c0 6.05 3.86 11.34 9.52 13.25v5.71a1.508 1.508 0 0 0 1.5 1.5c.39 0 .76-.15 1.05-.43l6.19-6.03h25.12c7.72 0 14-6.28 14-14V31.13c0-7.72-6.28-14-14-14H22.06c-7.72 0-14 6.28-14 14z" opacity="1" data-original="url(#b)" class="" style="
      /* fill: #3F88F6; */
  "></path></g></svg>
      <span>Eminenture</span></div>
  </form>
</div>`;

  //Initial Introduction From
  const IIFContainer = document.createElement("div");
  IIFContainer.id = "IIFContainer";
  IIFContainer.className = "animate-fade-down commonEMBotPopUpForms";
  IIFContainer.innerHTML = `<div class="main-sub-container">
  <div class="intro-main">
    <div class="main-logo" id="flogo"><img src="https://chatbot-eta-ten-41.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FembotLogo.e7ce9467.png&w=128&q=75"></div>
    <div class="titile-hi-there">
      <div>Hi there👋 <br> Access Features Now</div>
    </div>
    <div id="chatBoxIdeal" class="chatBoxIdeal">
    <div class="botChatPASSpan">
      <span>Unlock the Complete Experience! Want to access all features and engage in live chat with our assistant? Simply provide your email address below.</span>
    </div>
  </div>
  </div>
  <div class="form-container">
    <div class="icon-container ply-icon-container">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M437.02 74.98C388.668 26.63 324.379 0 256 0S123.332 26.629 74.98 74.98C26.63 123.332 0 187.621 0 256s26.629 132.668 74.98 181.02C123.332 485.37 187.621 512 256 512s132.668-26.629 181.02-74.98C485.37 388.668 512 324.379 512 256s-26.629-132.668-74.98-181.02zM111.105 429.297c8.454-72.735 70.989-128.89 144.895-128.89 38.96 0 75.598 15.179 103.156 42.734 23.281 23.285 37.965 53.687 41.742 86.152C361.641 462.172 311.094 482 256 482s-105.637-19.824-144.895-52.703zM256 269.507c-42.871 0-77.754-34.882-77.754-77.753C178.246 148.879 213.13 114 256 114s77.754 34.879 77.754 77.754c0 42.871-34.883 77.754-77.754 77.754zm170.719 134.427a175.9 175.9 0 0 0-46.352-82.004c-18.437-18.438-40.25-32.27-64.039-40.938 28.598-19.394 47.426-52.16 47.426-89.238C363.754 132.34 315.414 84 256 84s-107.754 48.34-107.754 107.754c0 37.098 18.844 69.875 47.465 89.266-21.887 7.976-42.14 20.308-59.566 36.542-25.235 23.5-42.758 53.465-50.883 86.348C50.852 364.242 30 312.512 30 256 30 131.383 131.383 30 256 30s226 101.383 226 226c0 56.523-20.86 108.266-55.281 147.934zm0 0" fill="#000000" opacity="1" data-original="#000000" class=""></path></g></svg>
    </div>
    <form id="introductionForm">
      <label for="email">Please introduce yourself:</label>
      <div class="input-container">
        <input type="email" id="triggerInput2" name="Email_Check" placeholder="Your Email" required>
        <button style="padding:0 15px" class="handleSubmit2main submitfromBtnpiy" id="handleSubmit2" type="submit" class="submitfromBtnpiy">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="white" fill-rule="evenodd" d="M3.291 3.309a.75.75 0 0 0-.976.996l3.093 6.945H13a.75.75 0 0 1 0 1.5H5.408l-3.093 6.945a.75.75 0 0 0 .976.996l19-8a.75.75 0 0 0 0-1.382z" clip-rule="evenodd"/></svg>
        </button>
      </div>
    </form>
    <div class="AWF-close-btn" id="IIFCloseBtn">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/></svg>
   </div>
  </div>
</div>
`;

  //Assistant Not available form
  const ANAFContainer = document.createElement("div");
  ANAFContainer.id = "ANAFContainer";
  ANAFContainer.className = "animate-fade-down commonEMBotPopUpForms";
  ANAFContainer.innerHTML = `<div class="main-sub-container">
  <div class="intro-main" style="overflow: auto;background:${
    JSON.parse(localStorage.getItem("adminData")).theme
  }">
    <div class="main-logo" id="flogo"><img src="https://chatbot-eta-ten-41.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FembotLogo.e7ce9467.png&w=128&q=75"></div>
    <div class="AWF-main-heading">Assistant Unavailable – Leave Your Details, We'll Connect Soon?</div>
    <div id="chatBoxIdeal" class="chatBoxIdeal">
    <div class="botChatPASSpan">
    <div class="AWF-container">
      <form class="AWF-form" id="assistWaitingForm">
          <label class="AWF-label" for="AWF-email">Email:</label>
          <input class="AWF-input" type="email" id="AWF-email" value="${widget_user_email}" name="email" required>
          <label class="AWF-label" for="AWF-phone">Phone Number:</label>
          <input class="AWF-input" type="tel" id="AWF-phone" name="phone" required>
          <label class="AWF-label" for="AWF-message">Message:</label>
          <textarea class="AWF-textarea" id="AWF-message" name="message" rows="4" required></textarea>
          <input class="AWF-submit" type="submit" value="Submit">
      </form>
    </div>
    <div class="AWF-close-btn" id="ANAFCloseBtn">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/></svg>
   </div>
  </div>
  </div>
</div>
</div>`;

  // Quick Inquiry Form
  const QIFContainer = document.createElement("div");
  QIFContainer.id = "QIFContainer";
  //QIFContainer.style.display = "block";
  QIFContainer.className = "animate-fade-down commonEMBotPopUpForms";
  QIFContainer.innerHTML = `
<div class="main-sub-container">
  <div class="intro-main" style="overflow: auto;background:${
    JSON.parse(localStorage.getItem("adminData")).theme
  }">
    <div class="main-logo" id="flogo">
      <img src="https://chatbot-eta-ten-41.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FembotLogo.e7ce9467.png&w=128&q=75">
    </div>
    <div class="AWF-main-heading">Quick Inquiry</div>
    <div id="chatBoxIdeal" class="chatBoxIdeal">
      <div class="botChatPASSpan">
        <div class="QIF-container">
          <form class="AWF-form QIF-form" id="quickInquiryForm">
            <label class="AWF-label" for="QIF-name">Name:</label>
            <input class="AWF-input" type="text" id="QIF-name" name="name" required>
            <label class="AWF-label" for="QIF-email">Email:</label>
            <input class="AWF-input" type="email" id="QIF-email" value="${widget_user_email}" name="email" required>
            <label class="AWF-label" for="QIF-phone">Phone Number:</label>
            <input class="AWF-input" type="tel" id="QIF-phone" name="phone" required>
            <label class="AWF-label" for="QIF-message">Message:</label>
            <textarea class="AWF-textarea" id="QIF-message" name="message" rows="4" required></textarea>
            <input class="AWF-submit" type="submit" value="Submit">
          </form>
        </div>
      </div>
    </div>
    <div class="AWF-close-btn" id="QIFCloseBtn">
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/></svg>
    </div>
  </div>
</div>`;

  chatInterface.appendChild(IIFContainer);
  chatInterface.appendChild(ANAFContainer);
  chatInterface.appendChild(QIFContainer);
  chatInterfaceInnerDiv.appendChild(chatInterfaceHeader);
  chatInterfaceInnerDiv.appendChild(ChattingInterface);
  ChattingInterface.appendChild(alertDiv);
  chatInterface.appendChild(chatInterfaceInnerDiv);
  chatbotIcon.addEventListener("click", () => {
    if (chatInterface.style.display === "none") {
      chatInterface.style.display = "block";
      const user__id = localStorage.getItem("widget_user_id");
      setTimeout(() => {
        document.getElementById(
          "chatbotIconSymbol"
        ).innerHTML = `<svg class="animate-fade-down" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 15 15"><path fill="white" d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27"/></svg>`;
      }, 100);
    } else {
      chatInterface.style.display = "none";
      setTimeout(() => {
        document.getElementById(
          "chatbotIconSymbol"
        ).innerHTML = `<svg class="roboIconSvgMain animate-fade-down" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve"><g transform="matrix(1,0,0,1,0,0)"><path d="M467 151.06h-31.421C408.855 87.606 350.01 41.493 282.265 32.686c-67.134-8.95-133.096 16.89-176.25 68.906-12.686 15.293-22.749 31.919-30.117 49.468H45c-24.814 0-45 20.186-45 45v60c0 24.814 20.186 45 45 45h61.601l-6.445-19.673c-18.765-57.305-8.203-115.855 28.96-160.635 36.519-44.019 92.285-65.801 149.253-58.33 60.247 7.848 112.542 50.455 133.262 108.574l.126.337a129.933 129.933 0 0 1 7.031 27.393c4.497 28.052 1.934 56.484-7.397 82.222l-.066.179C388.164 346.886 325.87 391.06 256.293 391.06c-24.976 0-45.293 20.186-45.293 45s20.186 45 45 45 45-20.186 45-45v-20.23c59.894-14.236 110.202-56.693 134.383-114.771H467c24.814 0 45-20.186 45-45v-60c0-24.814-20.186-44.999-45-44.999z" fill="#ffffff" opacity="1" data-original="#000000" class=""></path><path d="M121 331.06v30h135c74.443 0 135-60.557 135-135s-60.557-135-135-135-135 60.557-135 135a134.921 134.921 0 0 0 28.828 83.394C146.21 322.095 134.667 331.06 121 331.06zm180-120h30v30h-30zm-60 0h30v30h-30zm-60 0h30v30h-30z" fill="#ffffff" opacity="1" data-original="#000000" class=""></path></g></svg>`;
      }, 100);
    }
    getChatBotData(userId);
  });

  chatbotContainer.appendChild(ChatBotIconDiv);
  chatbotContainer.appendChild(chatInterface);

  document.body.appendChild(chatbotContainer);
  chattingData();
  triggerMsg();
  FinalEmailSUbmitFrom();
};

function submitFunction(e, subtriggerValue) {
  e.preventDefault();
  getChatBotData(userId);
  let formName = e.target.id;
  let triggerInputTag;
  let triggerValue;
  if (formName == "introductionForm") {
    triggerInputTag = document.getElementById("triggerInput2");
    triggerValue = triggerInputTag.value;
    document.getElementById("IIFContainer").style.display = "none";
  } else {
    triggerInputTag = document.getElementById("triggerInput");
    triggerValue = triggerInputTag.value;
  }

  // console.log(getCookie("widget_user_email"));
  simulateSocketListener();
  if (triggerInputTag.name == "liveChat") {
    //Live chat user register

    if (triggerInputTag.type == "email") {
      const email = triggerInputTag.value;
      const existingIndex = mainChatData.findIndex(
        (item) => item.id === 199199
      );
      // If an object with the same ID is found, remove it from the array
      if (existingIndex !== -1) {
        mainChatData.splice(existingIndex, 1);
      }
      mainChatData.push({
        id: 199199,
        replaytext: triggerInputTag.value,
        responseMsg: `Hold on, our assistant is joining soon.😊 \n   <div id="timerCountDownDivResponse" class="timerCountDownDivResponseclass">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="black" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"/><rect width="2" height="7" x="11" y="6" fill="black" rx="1"><animateTransform attributeName="transform" dur="9s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></rect><rect width="2" height="9" x="11" y="11" fill="black" rx="1"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></rect></svg>
        <div style="font-size: 22px;" id="assisWaitingTimer">01:00</div>
      </div>`,
      });

      getLocation(email, userId, triggerInputTag);
    } else {
      //Live Chat socket io implimentation
      const widget_user_id = localStorage.getItem("widget_user_id");
      if (widget_user_id) {
        addMsg(triggerValue);
      }
      mainChatData.push({ replaytext: triggerValue });
    }
  } else if (triggerInputTag.name == "Email_Check") {
    if (isValidEmail(triggerInputTag.value)) {
      document.getElementById("AWF-email").value = triggerInputTag.value;
      widget_user_email = triggerInputTag.value;
      correctEmailCount = correctEmailCount + 1;
      const email = triggerInputTag.value;
      const existingIndex = mainChatData.findIndex(
        (item) => item.id === 199199
      );
      // If an object with the same ID is found, remove it from the array
      if (existingIndex !== -1) {
        mainChatData.splice(existingIndex, 1);
      }
      mainChatData.push({
        id: 199199,
        replaytext: triggerInputTag.value,
        responseMsg: `Hold on, our assistant is joining soon.😊 \n   <div id="timerCountDownDivResponse" class="timerCountDownDivResponseclass">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="black" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"/><rect width="2" height="7" x="11" y="6" fill="black" rx="1"><animateTransform attributeName="transform" dur="9s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></rect><rect width="2" height="9" x="11" y="11" fill="black" rx="1"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></rect></svg>
        <div style="font-size: 22px;" id="assisWaitingTimer">01:00</div>
      </div>`,
      });

      setTimeout(() => {
        startCountDownTimer(60, "assisWaitingTimer", function () {
          const mainTheme = JSON.parse(localStorage.getItem("adminData")).theme;
          document.querySelector(
            ".chatbot-container .commonEMBotPopUpForms .intro-main"
          ).style.background = mainTheme;
          document.getElementById("ANAFContainer").style.display = "block";
          document.getElementById("AWF-email").value =
            localStorage.getItem("widget_user_email");
        });
        correctEmailCount = 0;
        document.getElementById("timerCountDownDivResponse").style.visibility =
          "visible";
      }, 3000);

      getLocation(email, userId, triggerInputTag);
    } else if (wrongEmailCount == 2) {
      document.getElementById("IIFContainer").style.display = "block";
      wrongEmailCount = 0;
      const mainTheme = JSON.parse(localStorage.getItem("adminData")).theme;
      document.querySelector(
        ".chatbot-container .commonEMBotPopUpForms .intro-main"
      ).style.background = mainTheme;
      document.querySelector(
        ".chatbot-container #IIFContainer .handleSubmit2main"
      ).style.background = mainTheme;
    } else if (correctEmailCount > 0) {
      let emailValidResponse = {
        id: -1,
        responseMsg: "Please wait, our assistant is joining the chat",
        replaytext: subtriggerValue ? subtriggerValue : triggerValue,
      };
      mainChatData.push(emailValidResponse);
      // setTimeout(() => {
      //   addBotFromMsgmDashbord(emailValidResponse.responseMsg);
      // }, 2000);
    } else {
      wrongEmailCount = wrongEmailCount + 1;
      let emailValidResponse = {
        id: -1,
        responseMsg: "Oops... it doesn't look like an email address 🧐",
        replaytext: subtriggerValue ? subtriggerValue : triggerValue,
      };
      mainChatData.push(emailValidResponse);
      // setTimeout(() => {
      //   addBotFromMsgmDashbord(emailValidResponse.responseMsg);
      // }, 2000);
    }
  } else {
    let lowercaseMsg;

    if (subtriggerValue) {
      lowercaseMsg = subtriggerValue.toLowerCase();
    } else {
      lowercaseMsg = triggerValue.toLowerCase();
    }

    if (
      lowercaseMsg == "yes, please connect" &&
      localStorage.getItem("widget_user_email") != null
    ) {
      lowercaseMsg = "live support";
    }

    const widget_user_id = localStorage.getItem("widget_user_id");
    if (widget_user_id) {
      addMsg(lowercaseMsg);
    }
    // Find a matching response in responseDataBOT based on lowercaseMsg
    let matchingResponse = responseDataBOT.find((response) =>
      response.triggerText.some(
        (trigger) => trigger.toLowerCase() === lowercaseMsg
      )
    );

    if (matchingResponse) {
      // If a matching response is found, add it to mainChatData
      matchingResponse["replaytext"] = subtriggerValue
        ? subtriggerValue
        : triggerValue;
      mainChatData.push(matchingResponse);

      setTimeout(() => {
        if (matchingResponse?.multipleRes == true) {
          addBotFromMsgmDashbord(
            "",
            "bot",
            null,
            null,
            matchingResponse?.responsesData
          );
        } else {
          addBotFromMsgmDashbord(matchingResponse?.responseMsg);
        }
      }, 2000);
    } else {
      // If no matching response is found, add a default response
      let defaultResponse = {
        id: -1,
        responseMsg:
          "I'm sorry, I don't understand that. Please ask something else.",
        replaytext: subtriggerValue ? subtriggerValue : triggerValue,
        suggestedTrigger: [
          "Tell me about your services?",
          "Would you like us to contact you?",
        ],
      };
      mainChatData.push(defaultResponse);
      setTimeout(() => {
        addBotFromMsgmDashbord(defaultResponse.responseMsg);
      }, 2000);
    }
    // console.log("matchingResponse?.replaytext", matchingResponse);
    if (matchingResponse?.responseMsg == "Sure thing, what's your email ID?") {
      let inputValue = document.getElementById("triggerInput");
      inputValue.setAttribute("name", "Email_Check");
    }

    if (matchingResponse?.replaytext == "end this conversation") {
      let inputTag = document.getElementById("triggerInput");
      inputTag.setAttribute("name", "bot");
      document.getElementById("alertDivId").style.display = "none";
      socket.off("checkAssitJoinedStatus");
      inputTag.addEventListener("focus", function () {
        inputTag.value = "";
      });
      // setTimeout(() => {
      //   socket.emit("logoutAutomatically", {
      //     adminId: userId,
      //     joinedExecutiveEmail: localStorage.getItem("joinedAssistantEmail"),
      //   });
      // }, 4000);
      // setTimeout(() => {
      //   localStorage.removeItem("joinedAssistantEmail");
      //   localStorage.removeItem("joinedAssistantId");
      // }, 5000);
    }

    if (matchingResponse?.replaytext.toLowerCase() == "quick enquiry") {
      setTimeout(() => {
        const mainTheme = JSON.parse(localStorage.getItem("adminData")).theme;
        document.querySelector(
          ".chatbot-container .commonEMBotPopUpForms .intro-main"
        ).style.background = mainTheme;
        document.getElementById("QIF-email").value =
          localStorage.getItem("widget_user_email");

        let QIFContainer = document.getElementById("QIFContainer");
        document.getElementById("chat-interface").appendChild(QIFContainer);
        QIFContainer.style.display = "block";
      }, 3000);
    }
  }
  subtriggerValue = "";
  document.getElementById("triggerInput").value = "";
  chattingData();
  // console.log("mainChatData", mainChatData);
}

const triggerMsg = () => {
  document
    .getElementById("sendMsgForm")
    .addEventListener("submit", submitFunction);
};

const FinalEmailSUbmitFrom = () => {
  document
    .getElementById("introductionForm")
    .addEventListener("submit", submitFunction);
};
appendData();

function chattingData() {
  const parent = document.getElementById("chatting-main");
  parent.innerHTML = "";
  const loadingIndicator = document.createElement("div");
  loadingIndicator.className = "loading-dots-embot";
  loadingIndicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><circle cx="18" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="6" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle></svg>`;

  let switchToBotBtnDiv = document.createElement("div");
  switchToBotBtnDiv.className = "switchToBotBtnClass";
  switchToBotBtnDiv.id = "switchToBotBtn";
  switchToBotBtnDiv.title = "End Live Chat Session";
  switchToBotBtnDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="black" d="M10 2.29v2.124c.566.247 1.086.6 1.536 1.05C12.48 6.408 13 7.664 13 9s-.52 2.591-1.464 3.536C10.592 13.48 9.336 14 8 14s-2.591-.52-3.536-1.464C3.52 11.592 3 10.336 3 9s.52-2.591 1.464-3.536c.45-.45.97-.803 1.536-1.05V2.29a7 7 0 1 0 4 0M7 0h2v8H7z"/></svg>`;

  switchToBotBtnDiv.addEventListener("click", () => {
    document.getElementById("triggerInput").setAttribute("name", "bot");
    mainChatData.push({
      responseMsg:
        "Thank you for your interest! 🌟 Please continue with the bot",
    });
    document.getElementById("timerCountDownDivResponse")?.remove();
    clearInterval(assiWaitingInterval);
    correctEmailCount = 0;
    chattingData();

    setTimeout(() => {
      addBotFromMsgmDashbord(
        "Thank you for your interest! 🌟 Please continue with the bot"
      );
    }, 2000);
  });

  if (document.getElementById("triggerInput").name != "bot") {
    parent.appendChild(switchToBotBtnDiv);
  }

  mainChatData.forEach(
    (
      {
        responseMsg,
        replaytext,
        attachmentFile,
        suggestedTrigger,
        urlLabels,
        multipleRes,
        responsesData,
        assiMsgData,
        quickInquiryFromData,
        assiUnavailableFromData,
      },
      index
    ) => {
      //console.log(attachmentFile, "attachmentFile");
      //trigger
      let triggerDiv = document.createElement("div");
      triggerDiv.className = "trigger";

      let triggerInnerDiv = document.createElement("div");
      const triggerSpan = document.createElement("span");
      triggerSpan.innerText = replaytext;
      triggerSpan.style.color = "#fff";
      triggerSpan.style.background = JSON.parse(
        localStorage.getItem("adminData")
      ).theme;
      if (replaytext) {
        triggerInnerDiv.append(triggerSpan);
        triggerDiv.appendChild(triggerInnerDiv);
      }

      let assiUnavailableFromDiv = document.createElement("div");
      assiUnavailableFromDiv.className =
        "assiUnavailableFromDiv CommonFilledFromsShows";
      assiUnavailableFromDiv.innerHTML = `
      <h3>Contact Information</h3>
      <h3>${assiUnavailableFromData?.email}</h3>
      <h3>${assiUnavailableFromData?.phone}</h3>
      <p>${assiUnavailableFromData?.message}</p>`;

      if (assiUnavailableFromData != null) {
        triggerInnerDiv.append(assiUnavailableFromDiv);
        triggerDiv.appendChild(triggerInnerDiv);
      }

      let quickInquiryFormDiv = document.createElement("div");
      quickInquiryFormDiv.className =
        "quickInquiryFormDiv CommonFilledFromsShows";
      quickInquiryFormDiv.innerHTML = `
      <h3>Quick Inquiry Form</h3>
      <h3>${quickInquiryFromData?.name}</h3>
      <h3>${quickInquiryFromData?.email}</h3>
      <h3>${quickInquiryFromData?.phone}</h3>   
      <p>${quickInquiryFromData?.message}</p>`;

      if (quickInquiryFromData != null) {
        triggerInnerDiv.append(quickInquiryFormDiv);
        triggerDiv.appendChild(triggerInnerDiv);
      }

      //response
      let ResponseDiv = document.createElement("div");
      ResponseDiv.className = "response";
      ResponseDiv.innerHTML = "";
      let ResponseInnerDiv = document.createElement("div");
      ResponseInnerDiv.className = "innerDivResponse";
      let userIconResponse = document.createElement("div");
      if (assiMsgData?.assistantImage) {
        userIconResponse.className = "assistantBGImageStyle";
        userIconResponse.style.background = `url(${assiMsgData?.assistantImage})`;
      } else {
        userIconResponse.className = "submitfromBtnpiy2 sbfbt2SpecialBot";
        userIconResponse.style.background = JSON.parse(
          localStorage.getItem("adminData")
        ).theme;
        userIconResponse.innerHTML = `<svg class="responseBotMain" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g transform="matrix(1,0,0,1,0,0)"><path d="M467 151.06h-31.421C408.855 87.606 350.01 41.493 282.265 32.686c-67.134-8.95-133.096 16.89-176.25 68.906-12.686 15.293-22.749 31.919-30.117 49.468H45c-24.814 0-45 20.186-45 45v60c0 24.814 20.186 45 45 45h61.601l-6.445-19.673c-18.765-57.305-8.203-115.855 28.96-160.635 36.519-44.019 92.285-65.801 149.253-58.33 60.247 7.848 112.542 50.455 133.262 108.574l.126.337a129.933 129.933 0 0 1 7.031 27.393c4.497 28.052 1.934 56.484-7.397 82.222l-.066.179C388.164 346.886 325.87 391.06 256.293 391.06c-24.976 0-45.293 20.186-45.293 45s20.186 45 45 45 45-20.186 45-45v-20.23c59.894-14.236 110.202-56.693 134.383-114.771H467c24.814 0 45-20.186 45-45v-60c0-24.814-20.186-44.999-45-44.999z" fill="#ffffff" opacity="1" data-original="#000000" class=""></path><path d="M121 331.06v30h135c74.443 0 135-60.557 135-135s-60.557-135-135-135-135 60.557-135 135a134.921 134.921 0 0 0 28.828 83.394C146.21 322.095 134.667 331.06 121 331.06zm180-120h30v30h-30zm-60 0h30v30h-30zm-60 0h30v30h-30z" fill="#ffffff" opacity="1" data-original="#000000" class=""></path></g></svg>`;
      }

      let ResponseTextDiv = document.createElement("div");
      ResponseTextDiv.className = "responseTextDiv";
      const ResposeSpan = document.createElement("span");
      ResposeSpan.innerHTML = responseMsg;
      const loadingSpan = document.createElement("span");
      loadingSpan.append(loadingIndicator);
      let attachementImgDiv = document.createElement("div");
      attachementImgDiv.style.position = "relative";
      let attachementImg = document.createElement("img");
      attachementImg.src = attachmentFile;
      attachementImg.className = "attachmentImg";
      let attachementFileIframe = document.createElement("iframe");
      attachementFileIframe.src = attachmentFile;
      attachementFileIframe.width = "180px";
      attachementFileIframe.height = "180px";
      let attachementImgDownloadBtn = document.createElement("button");
      attachementImgDownloadBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="white" d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-6 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"/></svg>`;
      attachementImgDownloadBtn.className = "attachementImgDownloadBtn";
      attachementImgDownloadBtn.id = "attachementImgDownloadBtn";
      attachementImgDownloadBtn.addEventListener("click", () => {
        fetch(attachmentFile)
          .then((response) => response.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;

            // Set the "download" attribute with a suggested file name
            link.setAttribute("download", "embot_download.jpg");

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          })
          .catch((error) => {
            console.error("Error fetching or downloading the image:", error);
          });
      });

      if (attachmentFile?.length > 0) {
        if (isImageFileName(attachmentFile)) {
          attachementImgDiv.append(attachementImg, attachementImgDownloadBtn);
        } else {
          attachementImgDiv.append(
            attachementFileIframe,
            attachementImgDownloadBtn
          );
        }
      }
      const multipleResponseDiv = document.createElement("div");
      multipleResponseDiv.className = "multiple-response";
      if (multipleRes) {
        createSlider(responsesData, multipleResponseDiv);
      }

      let Subtriggers = document.createElement("div");
      Subtriggers.className = "subtriggerDiv";
      let urlLabelsDIv = document.createElement("div");
      urlLabelsDIv.className = "urlLabelsDIv";

      if (responseDataBOT) {
        suggestedTrigger?.map((elem, index) => {
          const button = document.createElement("button");
          button.className = "subtriggerBtn";
          button.innerText = elem;
          button.key = index;
          button.addEventListener("click", (e) => {
            if (elem == "end this conversation") {
              e.preventDefault();
              let inputTag = document.getElementById("triggerInput");
              inputTag.setAttribute("name", "bot");
              wrongEmailCount = 0;
              submitFunction(e, elem);
              document.getElementById("alertDivId").style.display = "none";
              setTimeout(() => {
                socket.emit("logoutAutomatically", {
                  adminId: userId,
                  joinedExecutiveEmail: localStorage.getItem(
                    "joinedAssistantEmail"
                  ),
                });
              }, 2000);
              setTimeout(() => {
                localStorage.removeItem("joinedAssistantEmail");
                localStorage.removeItem("joinedAssistantId");
              }, 4000);
            } else if (
              responseMsg == "Would you like us to contact you?" &&
              elem == "Not Yet"
            ) {
              mainChatData.push({
                responseMsg:
                  "Thank you for your time. Live chat is now closed😊",
                replaytext: "Not Yet",
                suggestedTrigger: [
                  "Tell me about your services?",
                  "Tell me about your company?",
                  "Would you like us to contact you?",
                ],
              });
              wrongEmailCount = 0;
              clearInterval(assiWaitingInterval);
              document
                .getElementById("triggerInput")
                .setAttribute("name", "bot");
              chattingData();

              setTimeout(() => {
                addMsg("Not Yet");
                addBotFromMsgmDashbord(
                  "Thank you for your time. Live chat is now closed😊"
                );
              }, 1000);
              document.getElementById("timerCountDownDivResponse").remove();
            } else if (
              elem == "Yes, Please connect" &&
              responseMsg == "Would you like us to contact you?"
            ) {
              let emailAllReadyGiven =
                localStorage.getItem("widget_user_email");

              if (emailAllReadyGiven != null) {
                const existingIndex = mainChatData.findIndex(
                  (item) => item.id === 199199
                );
                // If an object with the same ID is found, remove it from the array
                if (existingIndex !== -1) {
                  mainChatData.splice(existingIndex, 1);
                }
                mainChatData.push({
                  id: 199199,
                  replaytext: `Yes please, Connect \n ${emailAllReadyGiven}`,
                  responseMsg: `Hold on, our assistant is joining soon.😊 \n   <div id="timerCountDownDivResponse" class="timerCountDownDivResponseclass">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="black" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"/><rect width="2" height="7" x="11" y="6" fill="black" rx="1"><animateTransform attributeName="transform" dur="9s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></rect><rect width="2" height="9" x="11" y="11" fill="black" rx="1"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></rect></svg>
                  <div style="font-size: 22px;" id="assisWaitingTimer">01:00</div>
                </div>`,
                });

                document
                  .getElementById("triggerInput")
                  .setAttribute("name", "going_live");
                setTimeout(() => {
                  addMsg(`Yes please, Connect \n ${emailAllReadyGiven}`);
                  addBotFromMsgmDashbord(
                    "Hold on, our assistant is joining soon.😊"
                  );
                }, 1000);
                setTimeout(() => {
                  startCountDownTimer(60, "assisWaitingTimer", function () {
                    const mainTheme = JSON.parse(
                      localStorage.getItem("adminData")
                    ).theme;
                    document.querySelector(
                      ".chatbot-container .commonEMBotPopUpForms .intro-main"
                    ).style.background = mainTheme;
                    document.getElementById("ANAFContainer").style.display =
                      "block";
                    document.getElementById("AWF-email").value =
                      localStorage.getItem("widget_user_email");
                  });
                  document.getElementById(
                    "timerCountDownDivResponse"
                  ).style.visibility = "visible";
                }, 3000);

                getLocation(
                  emailAllReadyGiven,
                  userId,
                  document.getElementById("triggerInput")
                );
                chattingData();
              } else {
                e.preventDefault();
                submitFunction(e, elem);
              }
            } else {
              e.preventDefault();
              submitFunction(e, elem);
            }
          });
          Subtriggers.appendChild(button);
        });
      }

      ResponseTextDiv.appendChild(ResposeSpan);
      if (attachmentFile) {
        ResponseTextDiv.appendChild(attachementImgDiv);
      }
      if (suggestedTrigger) {
        ResponseTextDiv.appendChild(Subtriggers);
      }
      if (urlLabels) {
        urlLabels.map((elem, index) => {
          const button = document.createElement("button");
          button.key = index;
          button.className = "urlLabelbtn";

          button.innerText = elem.label;
          const icon = document.createElement("div");
          icon.className = "submitfromBtnpiy2";
          icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 10.5L21 3m-5 0h5v5m0 6v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>`;
          button.appendChild(icon);
          button.addEventListener("click", () => {
            // window.location.href = elem.link;
            window.open(elem.link, "_blank");
          });
          urlLabelsDIv.appendChild(button);
        });
        ResponseTextDiv.appendChild(urlLabelsDIv);
      }
      // ResponseInnerDiv.append(userIconResponse, ResponseTextDiv);
      if (index != mainChatData.length - 1) {
        ResponseInnerDiv.append(userIconResponse, ResponseTextDiv);
      } else {
        ResponseInnerDiv.append(userIconResponse, loadingSpan);
        ResponseDiv.appendChild(ResponseInnerDiv);
        setTimeout(() => {
          ResponseInnerDiv.removeChild(loadingSpan);
          ResponseInnerDiv.appendChild(ResponseTextDiv);
          parent.scrollTop = parent.scrollHeight;
        }, 2000);
      }

      !multipleRes && ResponseDiv.appendChild(ResponseInnerDiv);

      if (responseMsg != undefined && replaytext == undefined) {
        parent.appendChild(ResponseDiv);
      } else if (responseMsg == undefined && replaytext != undefined) {
        parent.appendChild(triggerDiv);
      } else {
        parent.append(triggerDiv, ResponseDiv);
      }
      if (multipleRes) {
        parent.append(multipleResponseDiv);
        parent.scrollTop = parent.scrollHeight;
      }
    }
  );
  parent.scrollTop = parent.scrollHeight;
}

chattingData();

//send msg
async function addMsg(
  TextMsgdata,
  assiUnavailableFromData,
  quickInquiryFromData
) {
  // console.log(TextMsgdata, "TextMsgdata");
  setTimeout(() => {
    socket.emit("sendMsg", {
      to: localStorage.getItem("joinedAssistantId") || userId,
      from: localStorage.getItem("widget_user_id"),
      message: TextMsgdata,
      assiUnavailableFromData: assiUnavailableFromData
        ? assiUnavailableFromData
        : null,
      quickInquiryFromData: quickInquiryFromData ? quickInquiryFromData : null,
    });
  }, 1000);

  const API_PATH = `${host_URL}/live/addmsg`;
  fetch(API_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: localStorage.getItem("joinedAssistantId") || userId,
      from: localStorage.getItem("widget_user_id"),
      message: TextMsgdata,
      type: localStorage.getItem("joinedAssistantId") ? "livechat" : "bot",
      assiUnavailableFromData: assiUnavailableFromData
        ? assiUnavailableFromData
        : null,
      quickInquiryFromData: quickInquiryFromData ? quickInquiryFromData : null,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.status == "success") {
        // toast.success(data.message);
        // console.log(data.message, "if");
      } else {
        //   toast.error(data.message);
        //console.log(data.message, "else");
      }
    })
    .catch((e) => {
      console.error(e);
    });

  //   mainChatData.push({ replaytext: TextMsgdata });
}
//get msg
async function getMsg(parametersData) {
  //console.log("msg", "msd");
  try {
    const res = await fetch(`${host_URL}/live/getmsg`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parametersData),
    });
    const data = await res.json();
    // console.log(data);
    data?.projectMessages?.forEach((elem) => {
      if (elem.myself === false) {
        mainChatData.push({
          responseMsg: elem.message,
          attachmentFile: elem?.attachmentFile,
          assiMsgData: elem?.assiMsgData,
          responsesData: elem?.responsesData,
          multipleRes: elem?.responsesData.length > 0 ? true : false,
        });
      } else {
        mainChatData.push({
          replaytext: elem.message,
          quickInquiryFromData: elem?.quickInquiryFromData,
          assiUnavailableFromData: elem?.assiUnavailableFromData,
        });
      }
    });

    chattingData();
    const parent = document.getElementById("chatting-main");
    parent.scrollTop = parent.scrollHeight;
  } catch (e) {
    console.log(e);
  }
}

//get particular user
async function getParticularUser(userId) {
  try {
    const res = await fetch(`${host_URL}/live/get-puser/${userId}`);
    const data = await res.json();
    //console.log(data);
    setTimeout(() => {
      if (data.data.joinedExecutive.status == false) {
        socket.emit("updateUserAssistantStatus", userId);
      } else {
        const inputValue = document.getElementById("triggerInput");
        inputValue.setAttribute("name", "liveChat");
      }
    }, 1000);
  } catch (e) {
    console.log(e);
  }
}

// Throttle function implementation
function throttle(func, delay) {
  let canCall = true;

  return function () {
    if (canCall) {
      func.apply(this, arguments);
      canCall = false;
      // setTimeout(() => {
      //   canCall = true;
      // }, delay);
    }
  };
}

function initialRegisterUser(inputData) {
  const API_PATH = `${host_URL}/live/create-user/${userId}`;
  fetch(API_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputData),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      // console.log(data);
      localStorage.setItem("widget_user_id", data?.user?._id);
      localStorage.setItem("widget_user_email", data?.user?.userEmail);

      // adding user to map

      socket.emit("addUser", data?.user?._id);
      // const payload = { from: data?.user?._id };
      // getMsg(payload);
      setTimeout(() => {
        //sending notification to admin user is joined
        const NotifyData = {
          userInfo: {
            userName: data?.user?.userName,
            userEmail: data?.user?.userEmail,
            _id: data?.user?._id,
            visitedPage: data?.user?.visitedPage,
          },
          adminId: userId,
          notificationMsg: "is Registerd on chatbot from",
        };
        socket.emit("notifications", NotifyData);
      }, 2000);
    })
    .catch((e) => {
      console.error(e);
    });
}

async function getInitialUserLocation(email) {
  try {
    const res = await fetch("https://ipapi.co/json");
    const data = await res.json();
    if (data) {
      const payload = {
        userName: email.split("@")[0],
        userEmail: email,
        userId: userId,
        location: {
          country_code: data?.country_code,
          ip: data?.ip,
          country_name: data?.country_name,
          region: data?.region,
          timezone: data?.timezone,
          longitude: data?.longitude,
          latitude: data?.latitude,
          city: data?.city,
        },
        visitedPage: window.location.href,
      };
      initialRegisterUser(payload);
    }
  } catch (e) {
    console.log(e);
  }
}

// document
//   .getElementById("introductionForm")
//   .addEventListener("submit", InitialUserRegisterFrom);

// function InitialUserRegisterFrom(e) {
//   e.preventDefault();
//   let emailInput = document.getElementById("introductionForm_email");
//   //console.log(emailInput.value);
//   getInitialUserLocation(emailInput.value);
// }

const endLiveChatfun = document.getElementById("ENdLiveChatButton");

async function addBotFromMsgmDashbord(
  TextMsgdata,
  type,
  assiMsgData,
  assiUnavailableFromData,
  responsesData
) {
  setTimeout(() => {
    socket.emit("sendMsg", {
      to: localStorage.getItem("widget_user_id"),
      from: localStorage.getItem("joinedAssistantId") || userId,
      message: TextMsgdata,
      type: type ? type : "bot",
      assiMsgData: assiMsgData ? assiMsgData : null,
      assiUnavailableFromData: assiUnavailableFromData
        ? assiUnavailableFromData
        : null,
      responsesData: responsesData?.length > 0 ? responsesData : [],
    });
  }, 1000);

  // console.log(TextMsgdata, "testingggggggggggggggggg");

  const API_PATH = `${host_URL}/live/addmsg`;
  fetch(API_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: localStorage.getItem("widget_user_id"),
      from: localStorage.getItem("joinedAssistantId") || userId,
      message: TextMsgdata,
      type: localStorage.getItem("joinedAssistantId") ? "livechat" : "bot",
      assiMsgData: assiMsgData ? JSON.stringify(assiMsgData) : null,
      assiUnavailableFromData: assiUnavailableFromData
        ? assiUnavailableFromData
        : null,
      responsesData: responsesData?.length > 0 ? responsesData : [],
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.status == "success") {
        // toast.success(data.message);
        //console.log(data.message);
      } else {
        // toast.error(data.message);
        //console.log(data.message);
      }
    })
    .catch((e) => {
      console.error(e);
    });

  //   mainChatData.push({ replaytext: TextMsgdata });
}

setTimeout(() => {
  //checking asssistant is joine or not
  socket.on("AssistantJoined", (data) => {
    const alertbox = document.getElementById("alertDivId");
    alertbox.style.display = "block";
    const alertText = document.getElementById("alertTextHedding");
    alertText.innerHTML = `${data?.Assi_userName} is joined`;
    localStorage.setItem("joinedAssistantId", data?.Assi__id);
    correctEmailCount = 0;
    localStorage.setItem("joinedAssistantEmail", data?.Assi_userEmail);
    document.getElementById("timerCountDownDivResponse")?.remove();
    clearInterval(assiWaitingInterval);
    let joinedAssitNotifyWithNameandImage = {
      id: -1,
      responseMsg: `${data?.Assi_userName} is joined`,
      assiMsgData: data,
    };
    mainChatData.push(joinedAssitNotifyWithNameandImage);

    setTimeout(() => {
      addBotFromMsgmDashbord(
        joinedAssitNotifyWithNameandImage.responseMsg,
        "livechat",
        data
      );
    }, 2000);
    setTimeout(() => {
      alertbox.style.display = "none";
      document.getElementById("ANAFContainer").style.display = "none";
    }, 2000);
    let inputValue = document.getElementById("triggerInput");
    inputValue.setAttribute("name", "liveChat");
    // inputValue.addEventListener("focus", () => {
    //   inputValue.setAttribute("name", "liveChat");
    // });

    socket.emit("addUser", localStorage.getItem("widget_user_id"));
    simulateSocketListener();
    // mainChatData.push({
    //   responseMsg: "Hello!",
    // });
    // chattingData();
  });

  socket.on("AssistantLogoutSuccessfully", (data) => {
    // console.log(data, "logout");
    const alertbox = document.getElementById("alertDivId");
    alertbox.style.display = "block";
    const alertText = document.getElementById("alertTextHedding");
    alertText.innerHTML = `${data?.Assi_userName} is left live chat`;
    localStorage.removeItem("joinedAssistantId");
    setTimeout(() => {
      alertbox.style.display = "none";
    }, 2000);
    let inputValue = document.getElementById("triggerInput");
    inputValue.setAttribute("name", "bot");
    // inputValue.addEventListener("focus", () => {
    //   inputValue.setAttribute("name", "bot");
    // });

    setTimeout(() => {
      localStorage.removeItem("joinedAssistantEmail");
      chatTranscriptFunc();
    }, 2000);

    mainChatData.push({
      responseMsg:
        "Assistant Left the Live Chat Session. Please continue with bot chat.",
      suggestedTrigger: [
        "Tell me about your services?",
        "Tell me about your company?",
        "What do you offer?",
      ],
    });

    chattingData();
  });
}, 4000);

//create user
function registerUser(inputData, triggerInputTag) {
  const API_PATH = `${host_URL}/live/create-user/${userId}`;
  fetch(API_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputData),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.status == "success") {
        getParticularUser(data?.user?._id);
        triggerInputTag.type = "text";
        triggerInputTag.setAttribute("placeholder", "type your message");
        localStorage.setItem("widget_user_id", data?.user?._id);
        localStorage.setItem("widget_user_email", data?.user?.userEmail);
        widget_user_email = data?.user?.userEmail;
        triggerInputTag.addEventListener("focus", function () {
          triggerInputTag.value = "";
        });
        setTimeout(() => {
          //sending notification to admin user is joined
          const NotifyData = {
            userInfo: {
              userName: data?.user?.userName,
              userEmail: data?.user?.userEmail,
              _id: data?.user?._id,
              visitedPage: data?.user?.visitedPage,
            },
            adminId: userId,
            notificationMsg: "is joined live chat from",
          };
          socket.emit("notifications", NotifyData);
        }, 1000);
        //checking asssistant is joine or not
        socket.on("checkAssitJoinedStatus", (data) => {
          if (data.status == false) {
            getParticularUser(data?.user?._id);
          } else {
            // console.log(data.msg, "yes");
            const alertbox = document.getElementById("alertDivId");
            alertbox.style.display = "block";
            const alertText = document.getElementById("alertTextHedding");
            alertText.innerHTML = `${data?.user?.joinedExecutive?.executive?.userName} is joined`;
            correctEmailCount = 0;

            // clearInterval(assiWaitingInterval);
            localStorage.setItem(
              "joinedAssistantId",
              data?.user?.joinedExecutive?.executive?._id
            );
            // triggerInputTag.addEventListener("focus", function () {
            //   // Set the input value to the placeholder text when focused
            //   triggerInputTag.value = "";
            // });
            setTimeout(() => {
              alertbox.style.display = "none";
            }, 2000);
          }
        });
        // adding user to map
        socket.emit("addUser", data?.user?._id);
        // const payload = { from: data?.user?._id };
        // getMsg(payload);
      } else {
        //   console.log(data);
      }
    })
    .catch((e) => {
      console.error(e);
    });
}
//tracking location
async function getLocation(email, userId, triggerInputTag) {
  try {
    const res = await fetch("https://ipapi.co/json");
    const data = await res.json();
    if (data) {
      const payload = {
        userName: email.split("@")[0],
        userEmail: email,
        userId: userId,
        uniqueIpAddress: data?.ip,
        location: {
          country_code: data?.country_code,
          ip: data?.ip,
          country_name: data?.country_name,
          region: data?.region,
          timezone: data?.timezone,
          longitude: data?.longitude,
          latitude: data?.latitude,
          city: data?.city,
        },
        visitedPage: window.location.href,
      };
      registerUser(payload, triggerInputTag);
    }
  } catch (e) {
    console.log(e);
  }
}

//slider component
function createSlider(responsesData, parent) {
  // let slideIndex = 1;
  //slider
  const slideshow_container = document.createElement("div");
  slideshow_container.className = "slideshow-container";
  // Next and previous buttons
  //console.log("responsesData", responsesData);
  responsesData?.map((elem, index) => {
    const slide = document.createElement("div");
    slide.className = `mySlides ${elem?._id}`;
    slide.key = index;

    //slide card
    const swiper_slide_card = document.createElement("div");
    swiper_slide_card.className = "swiper-slide animate-fade-right";

    //image div and tag
    const sliderImageDiv = document.createElement("div");
    sliderImageDiv.className = "sliderImageDiv";
    const sliderImgTag = document.createElement("img");
    sliderImgTag.src = elem?.attachmentFile;

    //slider-slide-content div

    const slider_slide_content = document.createElement("div");
    slider_slide_content.className = "swiper-slide-content";

    //title
    const sliderTitle = document.createElement("h3");
    sliderTitle.innerText = elem?.title;

    //description
    const sliderDescription = document.createElement("p");
    sliderDescription.innerText = elem?.responseMsg;

    //links
    const sliderLinksDiv = document.createElement("div");
    sliderLinksDiv.className = "subtriggerDiv";
    elem?.urlLabels?.forEach((item, index) => {
      //anchor tags
      const sliderlink = document.createElement("a");
      sliderlink.className = "subtriggerBtn";
      sliderlink.key = index;
      sliderlink.href = item?.link;
      sliderlink.title = item?.link;
      sliderlink.innerText = item?.label;
      sliderlink.target = "_blank";
      sliderLinksDiv.appendChild(sliderlink);
    });

    //subtriggers

    let Subtriggers = document.createElement("div");
    Subtriggers.className = "subtriggerDiv";
    if (!elem?.suggestedTrigger.includes("Quick Enquiry")) {
      elem?.suggestedTrigger.push("Quick Enquiry");
    }
    elem?.suggestedTrigger?.map((item, index) => {
      const button = document.createElement("button");
      button.className = "subtriggerBtn";
      button.innerText = item;
      button.key = index;
      button.addEventListener("click", (e) => {
        if (item == "Quick Enquiry") {
          setTimeout(() => {
            const mainTheme = JSON.parse(
              localStorage.getItem("adminData")
            ).theme;
            document.querySelector(
              ".chatbot-container .commonEMBotPopUpForms .intro-main"
            ).style.background = mainTheme;
            document.getElementById("QIF-email").value =
              localStorage.getItem("widget_user_email");

            let QIFContainer = document.getElementById("QIFContainer");
            document.getElementById("chat-interface").appendChild(QIFContainer);
            QIFContainer.style.display = "block";
          }, 3000);
        }
        e.preventDefault();
        submitFunction(e, item);
      });
      Subtriggers.appendChild(button);
    });

    //button wrap up div
    let wrapButtonsDivMain = document.createElement("div");
    wrapButtonsDivMain.className = "wrapButtonsDivMain";
    wrapButtonsDivMain.append(sliderLinksDiv, Subtriggers);

    //appends
    sliderImageDiv.appendChild(sliderImgTag);

    slider_slide_content.append(sliderTitle, sliderDescription);
    swiper_slide_card.append(
      sliderImageDiv,
      slider_slide_content,
      wrapButtonsDivMain
    );
    slide.appendChild(swiper_slide_card);
    slideshow_container.appendChild(slide);
  });

  const prev = document.createElement("a");
  prev.className = "EM-prev";
  prev.innerHTML = `&#10094;`;
  prev.addEventListener("click", () => {
    plusSlides(-1, parent);
  });

  const next = document.createElement("a");
  next.className = "EM-next";
  next.innerHTML = `&#10095;`;
  next.addEventListener("click", () => {
    plusSlides(1, parent);
  });

  //appends
  slideshow_container.append(prev, next);
  parent.appendChild(slideshow_container);
  showSlides(1, parent);
}
//slider
let slideIndex = 1;

// Next/previous controls
function plusSlides(n, container) {
  showSlides((slideIndex += n), container);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides((slideIndex = n));
}
function isImageFileName(filename) {
  // List of common image file extensions
  const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "svg",
    "webp",
    "avif",
  ];
  // Extract the file extension from the filename
  const parts = filename.split(".");
  const extension = parts[parts.length - 1].toLowerCase();
  return imageExtensions.includes(extension);
}
function showSlides(n, container) {
  let i;

  let slides = container.getElementsByClassName("mySlides");

  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  if (slides.length > 0) {
    slides[slideIndex - 1].style.display = "block";
  }
}

//function for validating email addresses
function isValidEmail(email) {
  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

//Count Down Timer

function startCountDownTimer(
  durationInSeconds,
  displayElement,
  onFinishCallback
) {
  let time = durationInSeconds;
  const timerElement = document.getElementById(displayElement);

  function updateTimer() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    timerElement.textContent = `${minutes}:${seconds}`;
    if (time-- <= 0) {
      clearInterval(assiWaitingInterval); // Clear interval on timeout
      timerElement.textContent = "00:00";
      if (onFinishCallback && typeof onFinishCallback === "function") {
        onFinishCallback();
      } else {
        alert("Timeout is over!");
      }
    }
  }

  updateTimer(); // Update timer immediately
  assiWaitingInterval = setInterval(updateTimer, 1000); // Set interval globally
}

// assistant waiting form submit function

function submitAssistantWaitingFrom(e) {
  e.preventDefault();

  const email = document.getElementById("AWF-email").value;
  const phone = document.getElementById("AWF-phone").value;
  const message = document.getElementById("AWF-message").value;
  const assiUnavailableFromData = { email, phone, message };

  addMsg("", assiUnavailableFromData);
  document.getElementById("ANAFContainer").style.display = "none";
  document.getElementById("alertDivId").style.display = "none";
  document.getElementById("timerCountDownDivResponse").style.visibility =
    "hidden";

  setTimeout(() => {
    mainChatData.push({
      replaytext: "",
      assiUnavailableFromData,
    });
    mainChatData.push({
      responseMsg:
        "Thank you for completing the form! We'll reach out to you shortly.",
      suggestedTrigger: [
        "Tell me about your services?",
        "Tell me about your company?",
        "What do you offer?",
      ],
    });
    chattingData();
    let inputTag = document.getElementById("triggerInput");
    inputTag.setAttribute("name", "bot");
    document.getElementById("timerCountDownDivResponse")?.remove();
  }, 2000);
}

document
  .getElementById("assistWaitingForm")
  .addEventListener("submit", submitAssistantWaitingFrom);

// quick inquery form
function quickInquiryFromSubmitFunc(e) {
  e.preventDefault();
  const name = document.getElementById("QIF-name").value;
  const email = document.getElementById("QIF-email").value;
  const phone = document.getElementById("QIF-phone").value;
  const message = document.getElementById("QIF-message").value;
  const quickInquiryFromData = { name, email, phone, message };
  //console.log(quickInquiryFromData, "quickInquiryFromData");

  addMsg("", null, quickInquiryFromData);
  document.getElementById("QIFContainer").style.display = "none";
  setTimeout(() => {
    mainChatData.push({
      replaytext: "",
      quickInquiryFromData,
    });
    mainChatData.push({
      responseMsg:
        "Thanks for your enquiry! We've got your info and will reach out soon. Have a great day!",
      suggestedTrigger: [
        "Tell me about your services?",
        "Tell me about your company?",
      ],
    });
    chattingData();
  }, 2000);
}
document
  .getElementById("quickInquiryForm")
  .addEventListener("submit", quickInquiryFromSubmitFunc);

//chat transcriptIcon functions
function chatTranscriptFunc() {
  const alertbox = document.getElementById("alertDivId");
  alertbox.style.display = "block";
  alertText.innerHTML = "Loading...";
  fetch(`${host_URL}/live/chat-transcript`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mainChatData,
      userEmail: JSON.parse(localStorage.getItem("adminData")).email,
    }),
  })
    .then((res) => {
      //console.log(res, "res");
      return res.json();
    })
    .then((response) => {
      const alertbox = document.getElementById("alertDivId");
      // alertText.innerHTML = response?.message;
      setTimeout(() => {
        alertbox.style.display = "none";
      }, 2000);
    })
    .catch((e) => {
      console.log(e);
    });
}

//form hides
document.getElementById("IIFCloseBtn").addEventListener("click", () => {
  document.getElementById("IIFContainer").style.display = "none";
  document.getElementById("triggerInput").setAttribute("name", "bot");
});
document.getElementById("QIFCloseBtn").addEventListener("click", () => {
  document.getElementById("QIFContainer").style.display = "none";
  document.getElementById("triggerInput").setAttribute("name", "bot");
});
document.getElementById("ANAFCloseBtn").addEventListener("click", () => {
  document.getElementById("ANAFContainer").style.display = "none";
  document.getElementById("timerCountDownDivResponse")?.remove();
  document.getElementById("triggerInput").setAttribute("name", "bot");
  mainChatData.push({
    responseMsg: "Thank you for your interest! 🌟 Please continue with the bot",
  });
  chattingData();
});
