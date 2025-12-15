import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
const XMarkIcon = dynamic(() =>
  import("@heroicons/react/24/outline/XMarkIcon")
);
const LightBulbIcon = dynamic(() =>
  import("@heroicons/react/24/solid/LightBulbIcon")
);

const SuggestedTriggersList = ({ setShowST }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth - 700, // Initial position is at the right
    y: 10, // Initial position is at the top
  });
  const componentRef = useRef(null);
  const initialPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX - initialPosition.current.x;
        const newY = e.clientY - initialPosition.current.y;
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    const handleMouseDown = (e) => {
      if (componentRef.current && componentRef.current.contains(e.target)) {
        setIsDragging(true);
        initialPosition.current.x = e.clientX - position.x;
        initialPosition.current.y = e.clientY - position.y;
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isDragging]);

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

  return (
    <div
      className={`transform overflow-hidden text-left transition-all sm:my-8 sm:w-full sm:max-w-lg suggested-triggers-list fixed bg-white p-4 shadow-md border border-gray-300 rounded`}
      style={{ left: position.x, top: position.y }}
    >
      <div
        ref={componentRef}
        className={`flex justify-between items-center ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <h2 className="text-xl font-semibold flex gap-2">
          <LightBulbIcon className="w-7 h-7 text-orange-400" />
          <span>Suggested Triggers Ideas</span>
        </h2>
        <button className="close-button" onClick={() => setShowST(false)}>
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </button>
      </div>
      <hr className="my-4" />

      <div className="space-y-4 flex flex-wrap overflow-hidden overflow-y-auto h-[50vh]">
        {data?.map((section, index) => (
          <div key={index}>
            <h2 className="text-md font-semibold mb-2 text-gray-700">
              {section.heading}
            </h2>
            <ul className="list-disc pl-6">
              {section.items.map((item, itemIndex) => (
                <li className="text-sm cursor-copy" key={itemIndex}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedTriggersList;
