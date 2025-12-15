export const triggers = [
  {
    trigger_Name: "First visit on site",
    iconName: `<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="size-6 w-7 h-7 text-center align-middle"
      >
        <path stroke="transparent" d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
        <path stroke="transparent" d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
      </svg>`,
    id: 1,
    decisiontrigger: "false",
    nodeHandles: 1,
    howItsWorksText:
      "Will be triggered on a visitor's first visit on your website. Works only once for every visitor.",
  },
];
export const actions = [
  {
    trigger_Name: "Send a response",
    iconName: `<svg xmlns="http://www.w3.org/2000/svg"   fill="transparent"
        stroke="white"
        className="size-6 w-7 h-7 text-center align-middle" viewBox="0 0 24 24" stroke-width="1.5" >
  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
</svg>
`,
    id: 1,
    nodeHandles: 2,
    decisiontrigger: "false",
    howItsWorksText:
      "A chat message will be sent to the visitor after the last action occurs or is initiated.",
  },
  {
    trigger_Name: "Questionable Trigger",
    iconName: `<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          fill="white"
          d="M12 23q-2.8 0-5.15-1.275T3 18.325V20q0 .425-.288.713T2 21t-.712-.288T1 20v-4q0-.425.288-.712T2 15h4q.425 0 .713.288T7 16t-.288.713T6 17H4.525q1.2 1.8 3.163 2.9T12 21q3.525 0 6.063-2.35t2.887-5.775q.05-.4.35-.638T22 12q.425 0 .725.263t.25.637q-.175 2.125-1.1 3.962t-2.4 3.2t-3.387 2.15T12 23m0-20Q8.475 3 5.938 5.35T3.05 11.125q-.05.4-.35.638T2 12q-.425 0-.725-.262t-.25-.638q.175-2.125 1.1-3.962t2.4-3.2t3.388-2.15T12 1q2.8 0 5.15 1.275t3.85 3.4V4q0-.425.288-.712T22 3t.713.288T23 4v4q0 .425-.288.713T22 9h-4q-.425 0-.712-.288T17 8t.288-.712T18 7h1.475q-1.2-1.8-3.162-2.9T12 3m0 15q.525 0 .888-.363t.362-.887t-.363-.9t-.887-.375t-.888.363t-.362.887t.363.9T12 18m2-6.25q.875-.875 1.163-1.412t.287-1.288q0-1.4-1-2.225T12 6q-1 0-1.775.413T8.95 7.625q-.2.325-.062.7t.487.525t.675-.025t.575-.475t.6-.475T12 7.7q.675 0 1.138.388t.462 1.037q0 .425-.2.85t-.85 1q-.625.55-.937 1.075t-.438 1.2q-.05.375.2.663t.65.287q.375 0 .625-.288t.35-.662q.1-.425.338-.75t.662-.75"
        ></path>
      </svg>`,
    id: 2,
    nodeHandles: 2,
    decisiontrigger: "true",
    howItsWorksText: "The visitor will be asked a question.",
  },
  {
    trigger_Name: "Decision (Buttons)",
    iconName: `<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          fill="white"
          d="M12 3a2 2 0 1 0 0 4a2 2 0 0 0 0-4m-1 5.874A4.002 4.002 0 0 1 12 1a4 4 0 0 1 1 7.874V11h4a3 3 0 0 1 3 3v1.126A4.002 4.002 0 0 1 19 23a4 4 0 0 1-1-7.874V14a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1.126A4.002 4.002 0 0 1 5 23a4 4 0 0 1-1-7.874V14a3 3 0 0 1 3-3h4zM19.003 17h-.006a2 2 0 1 0 .006 0M5 17a2 2 0 1 0 0 4a2 2 0 0 0 0-4"
        ></path>
      </svg>`,
    id: 3,
    nodeHandles: 3,
    decisiontrigger: "true",
    howItsWorksText:
      "The visitor will be asked to choose the answer from one of the buttons. Note that the buttons won't disappear after they were clicked so the visitor can return to them at any moment during the conversation.",
  },
  {
    trigger_Name: "Card Slider",
    iconName: `<svg xmlns="http://www.w3.org/2000/svg"   fill="transparent"
        stroke="white"
        className="size-6 w-7 h-7 text-center align-middle" viewBox="0 0 24 24" stroke-width="1.5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
</svg>
`,
    id: 4,
    nodeHandles: 3,
    decisiontrigger: "true",
    howItsWorksText:
      "Send out rich messages with texts, images, and buttons. The visitor will be asked to select the answer from one of the buttons. Note that the buttons won't disappear after they were clicked so the visitor can return to them at any moment during the conversation.",
  },
  {
    trigger_Name: "Custom Forms",
    iconName: `<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
      >
        <path
          fill="white"
          d="M12.25 6A6.25 6.25 0 0 0 6 12.25v23.5A6.25 6.25 0 0 0 12.25 42h11.794c-.5-.78-.919-1.618-1.244-2.5H12.25a3.75 3.75 0 0 1-3.75-3.75v-23.5a3.75 3.75 0 0 1 3.75-3.75h23.5a3.75 3.75 0 0 1 3.75 3.75V22.8c.882.325 1.72.744 2.5 1.244V12.25A6.25 6.25 0 0 0 35.75 6zM35 22q.488 0 .967.035q.033-.137.033-.285c0-.69-.56-1.25-1.25-1.25h-10.5a1.25 1.25 0 1 0 0 2.5h5.741A13 13 0 0 1 35 22m-23-8.75c0-.69.56-1.25 1.25-1.25h21.5a1.25 1.25 0 1 1 0 2.5h-21.5c-.69 0-1.25-.56-1.25-1.25m9 8.25a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-2.5 0a2 2 0 1 0-4 0a2 2 0 0 0 4 0m-2 15.5a4.5 4.5 0 1 0 0-9a4.5 4.5 0 0 0 0 9m0-2.5a2 2 0 1 1 0-4a2 2 0 0 1 0 4M46 35c0 6.075-4.925 11-11 11s-11-4.925-11-11s4.925-11 11-11s11 4.925 11 11m-10-7a1 1 0 1 0-2 0v6h-6a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2h-6z"
        ></path>
      </svg>`,
    id: 6,
    nodeHandles: 2,
    decisiontrigger: "false",
    howItsWorksText:
      "Sequential Form Presentation Based on User Actions. Display for User Input Collection.",
  },
  {
    trigger_Name: "Chat with Assistant",
    iconName: `
       <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="size-6 w-7 h-7 text-center align-middle"
      >
        <path
          fill="white"
          d="M8 4.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5M4 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m13-.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3M14 8a3 3 0 1 1 6 0a3 3 0 0 1-6 0M2 15.25A2.25 2.25 0 0 1 4.25 13h7.5c.316 0 .617.065.89.183c-.354.398-.66.84-.908 1.317H4.25a.75.75 0 0 0-.75.75v.257l.007.08c.007.074.023.188.055.329c.066.281.198.656.459 1.029C4.514 17.65 5.578 18.5 8 18.5c1.413 0 2.363-.29 3.008-.67c.027.536.119 1.055.268 1.55c-.835.38-1.907.62-3.276.62c-2.828 0-4.39-1.025-5.208-2.195a4.5 4.5 0 0 1-.778-2.07A3 3 0 0 1 2 15.529zm15.501 7.752a5.501 5.501 0 1 0-4.812-2.833l-.666 2.186a.5.5 0 0 0 .624.625l2.187-.666c.79.439 1.7.688 2.667.688m-2-6a.5.5 0 1 1 0-1.001h4a.5.5 0 1 1 0 1zm2 2h-2a.5.5 0 1 1 0-1h2a.5.5 0 1 1 0 1"
        ></path>
      </svg>
`,
    id: 7,
    nodeHandles: 2,
    decisiontrigger: "false",
    howItsWorksText:
      "Chat with Assistant triggers activate the live chat process when users seek assistance.",
  },

  {
    trigger_Name: "Enable text input",
    iconName: `<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
      >
        <path
          fill="white"
          d="M4 3.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V4H8.5v8H9a.5.5 0 0 1 0 1H7a.5.5 0 0 1 0-1h.5V4H5v.5a.5.5 0 0 1-1 0zm.354 3.146a.5.5 0 0 1 0 .708L2.207 9.5l2.147 2.146a.5.5 0 0 1-.708.708l-2.5-2.5a.5.5 0 0 1 0-.708l2.5-2.5a.5.5 0 0 1 .708 0m10.5 2.5l-2.5-2.5a.5.5 0 0 0-.708.708L13.793 9.5l-2.147 2.146a.5.5 0 0 0 .708.708l2.5-2.5a.5.5 0 0 0 0-.708"
        ></path>
      </svg>`,
    id: 9,
    nodeHandles: 2,
    decisiontrigger: "false",
    howItsWorksText: `When you add this node, you will allow visitors to type while a Flow is running. \n To add this node, you must first add the  Disable text input” node.`,
  },
  {
    trigger_Name: "Disable text input",
    iconName: `<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
      >
        <path
          fill="white"
          d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2s-6.3 25.5 4.1 33.7l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L355.7 253.5L400.2 96H503l-6 24.2c-4.3 17.1 6.1 34.5 23.3 38.8s34.5-6.1 38.8-23.3l11-44.1c7.5-30.3-15.4-59.6-46.6-59.6h-319c-22 0-41.2 15-46.6 36.4l-6.3 25.2zm168 131.7c.1-.3.2-.7.3-1L217 96h116.7l-32.4 114.8l-94.5-74.1zm120.5 217.1L272.9 311l-29.6 105H192c-17.7 0-32 14.3-32 32s14.3 32 32 32h160c17.7 0 32-14.3 32-32s-14.3-32-32-32h-42.2l17.6-62.1z"
        ></path>
      </svg>`,
    id: 10,
    nodeHandles: 2,
    decisiontrigger: "false",
    howItsWorksText: `When you add this node, your visitors won’t be able to type anything in the Flow while a Flow is running. \n The possibility to type will be disabled until you enable it again using the “Enable text input ” node or until the current flow ends`,
  },
];
export const conditions = [];
