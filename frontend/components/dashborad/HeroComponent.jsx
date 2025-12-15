import React from "react";
const HeroComponent = () => {
  return (
    <div className="container mx-auto my-8 p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 md:mr-8 mb-4 md:mb-0">
          <img
            src="https://www.chatbot.com/integrations/chat-widget/personalized-look_hub0cc53cc42fa5bc168dac927eb6fc7f7_128038_1340x0_resize_lanczos_3.png"
            alt="Chatbot Services"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-gray-800">
            Enhance Conversations: Unleashing the Potential of Dynamic Chatbot
            Interactions
          </h2>
          <ul className="list-disc pl-4 md:pl-6 text-base md:text-lg text-gray-700">
            <li>Customizable Triggers and Responses</li>
            <li>Rich Media Integration</li>
            <li>Live Chat Functionality</li>
            <li>User-Friendly Interface</li>
            <li>LLM Upgrades for Sharper Interactions</li>
            <li>Slider View for Multiple Responses</li>
            <li>Easy Installation with Script Tag</li>
            <li>Robust and Powerful</li>
            <li>Seamless Integration with Existing Platforms</li>
            <li>Continuous Improvement</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HeroComponent;
