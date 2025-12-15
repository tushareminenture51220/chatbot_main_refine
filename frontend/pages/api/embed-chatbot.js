import ReactDOMServer from "react-dom/server";
import Chatbot from "../../components/chatbot-preview/Chatbot";

export default function generateEmbedCode(req, res) {
  const chatbotMarkup = ReactDOMServer.renderToStaticMarkup(<Chatbot />);
  res.setHeader("Content-Type", "text/javascript");
  res.status(200).send(`
    (function () {
      const chatbotContainer = document.getElementById('chatbot-container');
      chatbotContainer.innerHTML = '${chatbotMarkup}';
    })();
  `);
}
