import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import WFSliderTriggerForm from "./WFSliderTriggerForm";
import dynamic from "next/dynamic";
import { useWorkFlowContextData } from "@/context/WorkFlowContext";
import { useReactFlow } from "reactflow";
const XMarkIcon = dynamic(import("@heroicons/react/24/outline/XMarkIcon"));
const PlusIcon = dynamic(import("@heroicons/react/24/solid/PlusIcon"));

const ParentSLiderComponent = () => {
  const splideRef = useRef(null);
  const [mainData, setMainData] = useState({ subTriggers: [] });
  const [slideCards, setSlideCards] = useState([{ id: uuidv4() }]);
  const [isLastSlideActive, setIsLastSlideActive] = useState(false);
  const [event, setEvent] = useState("change");
  const { setNodes } = useReactFlow();
  const {
    isActiveBottomTRForm,
    nextActionDelayTime,
    setNextActionDelayTime,
    databaseNodes,
  } = useWorkFlowContextData();

  const addSlideCard = () => {
    setSlideCards((prevCards) => [...prevCards, { id: uuidv4() }]);
    //console.log("splideRef", splideRef);
    if (splideRef.current) {
      const splide = splideRef.current.splide;
      const lastIndex = splide.length - 1;

      // Check if Splide instance exists and has slides
      if (lastIndex >= 0) {
        // Move to the last slide
        splide.go(lastIndex);
      }
    }
  };
  const removeSlideCard = (id, indexToDelete) => {
    const updatedData = slideCards.filter((elem) => elem.id !== id);
    setSlideCards(updatedData);
    setMainData((prevState) => {
      // Create a new object to store the updated data
      const updatedMainData = {};

      // Re-index the remaining items after deletion
      let newIndex = 0;
      Object.keys(prevState).forEach((key) => {
        if (key !== "subTriggers" && key !== indexToDelete) {
          updatedMainData[newIndex] = prevState[key];
          newIndex++;
        }
      });

      // Maintain or add subTriggers as per the original state
      if (prevState.hasOwnProperty("subTriggers")) {
        updatedMainData["subTriggers"] = prevState["subTriggers"];
      } else {
        updatedMainData["subTriggers"] = [];
      }

      return updatedMainData;
    });
    setEvent("submit");
  };
  const goToLastSlide = () => {
    if (splideRef.current) {
      const splide = splideRef.current.splide;
      const lastIndex = splide.length - 1;

      // Check if Splide instance exists and has slides
      if (lastIndex >= 0) {
        // Move to the last slide
        splide.go(lastIndex);
      }
    }
  };
  useEffect(() => {
    //console.log("mainData:-", mainData);
    if (event == "submit") {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === isActiveBottomTRForm.id
            ? {
                ...node,
                data: {
                  ...node.data,

                  right_label:
                    mainData?.subTriggers?.length >= 1 &&
                    mainData?.subTriggers[0]?.type === "action"
                      ? mainData?.subTriggers[0]?.value
                      : "",
                  left_label:
                    mainData?.subTriggers?.length >= 2 &&
                    mainData?.subTriggers[1]?.type === "action"
                      ? mainData?.subTriggers[1]?.value
                      : mainData?.subTriggers?.length >= 3 &&
                        mainData?.subTriggers[2]?.type === "action"
                      ? mainData?.subTriggers[2]?.value
                      : "",
                  message: mainData,
                  nextActionDelayTime,
                },
              }
            : node
        )
      );
      setEvent("normal");
    }
  }, [mainData]);

  // useEffect(() => {
  //   console.log(mainData);
  // }, [mainData]);

  useEffect(() => {
    let message = isActiveBottomTRForm?.activeNode?.data?.message;
    if (
      isActiveBottomTRForm?.activeNode?.data &&
      "message" in isActiveBottomTRForm?.activeNode?.data
    ) {
      message = message;
    } else {
      message = { ...message, subTriggers: [] };
    }
    // console.log("isActiveBottomTRForm", isActiveBottomTRForm);
    const keys = message && Object.keys(message);
    const numericKeys = keys.filter(
      (key) => !isNaN(key) && key !== "subTriggers"
    );

    // Check if there's greater thatn one numeric key
    const hasSingleNumericKey = numericKeys.length >= 1;
    // console.log("hasSingleNumericKey", hasSingleNumericKey);

    if (hasSingleNumericKey) {
      setMainData(message);
      setNextActionDelayTime(
        isActiveBottomTRForm?.activeNode?.data?.nextActionDelayTime
      );
      // const subTriggers = message?.subTriggers || [];
      // const numberOfSlides =
      //   subTriggers.length > 0
      //     ? 1
      //     : Object.keys(message).filter((key) => !isNaN(key)).length;
      const slides = Object.keys(message).filter(
        (key) => !isNaN(key) && key !== "subTriggers"
      );
      const numberOfSlides = slides.length;

      //console.log(numberOfSlides, "numberOfSlides");

      const initialSlides = Array.from({ length: numberOfSlides }, () => ({
        id: uuidv4(),
      }));
      setSlideCards(initialSlides);
    }
  }, [isActiveBottomTRForm]);
  useEffect(() => {
    if (splideRef.current) {
      const splide = splideRef.current.splide;

      // Add event listener to check when the slider moves
      splide.on("moved", () => {
        const activeIndex = splide.index;
        const totalSlides = splide.length;

        // Check if the active slide is the last slide
        setIsLastSlideActive(activeIndex === totalSlides - 1);
      });
    }
  }, []);

  useEffect(() => {
    // After the state has been updated with the new slide, navigate to the last slide
    if (splideRef.current && slideCards.length > 0) {
      const splide = splideRef.current.splide;
      const lastIndex = splide.length - 1;

      // Check if Splide instance exists and has slides
      if (lastIndex >= 0) {
        // Move to the last slide
        splide.go(lastIndex);
      }
    }
    if (slideCards.length == 1) {
      setIsLastSlideActive(true);
    }
  }, [slideCards]);

  return (
    <>
      <Splide
        aria-label="slider"
        options={{
          rewind: false,
          arrows: true,
          pagination: false,
        }}
        hasTrack={false}
        ref={splideRef}
      >
        <SplideTrack>
          {slideCards?.map((card, index) => (
            <SplideSlide key={index}>
              {slideCards?.length >= 2 && (
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete a slide card?"
                      )
                    ) {
                      slideCards?.length >= 2 &&
                        removeSlideCard(card?.id, index.toString());
                    }
                  }}
                  className="text-red-500 bg-gray-200 absolute right-0 top-0 w-5 h-5 cursor-pointer pointer-events-auto z-50"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
              <WFSliderTriggerForm
                mainData={mainData}
                setMainData={setMainData}
                setEvent={setEvent}
                idx={index}
              />
            </SplideSlide>
          ))}
        </SplideTrack>
        {isLastSlideActive && (
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to add a new slide card?")
              ) {
                addSlideCard();
              }
            }}
            className="bg-gray-300 text-gray-700 rounded-full absolute -right-9 transform top-1/2 -translate-y-1/2 z-50"
          >
            <PlusIcon className="w-7 h-7 text-gray-700 font-bold" />
          </button>
        )}
        <style>{`
          .splide__arrow--prev {
            left: -37.5px;
            backgroudn: white;
          }
          .splide__arrow--next {
            right: -38px;
            backgroudn: white;
          }
        `}</style>
      </Splide>
    </>
  );
};

export default ParentSLiderComponent;
