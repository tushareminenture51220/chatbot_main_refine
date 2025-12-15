// components/InitialResponseLabel.js
import { useAuth } from "@/context/AuthContext";
import { useChatBotData } from "@/context/ChatBotContest";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const InitialResponseLabel = ({ id, originalValue, setIsLoading }) => {
  const options = [
    { label: "None", value: "false" },
    { label: "1st", value: "1" },
    { label: "2nd", value: "2" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const { authJWTToken } = useAuth();
  const { getChatBotData } = useChatBotData();

  // console.log(selectedOption, "selectedOption");
  const editData = (value, id) => {
    setIsLoading(true);
    const API_PATH = `${process.env.NEXT_PUBLIC_EMBOT_API}/chatbot/update-initial-response/${id}`;
    let payload = { initialResponse: value };

    fetch(API_PATH, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authJWTToken}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setIsLoading(false);
        if (data.status == "error") {
          toast.error(data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          setIsLoading(false);
          getChatBotData(authJWTToken);
          toast.success(data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error.message);
        toast.error(error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option.value == originalValue) {
      setIsOpen(false);
    } else {
      const confirmation = window.confirm(
        `Are you sure to make its initial Response on position ${option.value}`
      );
      if (!confirmation) {
        const filtered = options.filter(
          (option) => option.value == originalValue
        );
        setSelectedOption(filtered[0]);
      }
      if (confirmation) {
        editData(option.value, id);
        setIsOpen(false);
      }
    }
  };
  useEffect(() => {
    if (originalValue != "false") {
      const filtered = options.filter(
        (option) => option.value == originalValue
      );
      setSelectedOption(filtered[0]);
    } else {
      setSelectedOption(options[0]);
    }
  }, [originalValue]);

  return (
    <>
      <div className="relative animate-fade-right">
        <div className="w-12 relative">
          <div
            className="relative w-full cursor-pointer"
            onClick={toggleDropdown}
          >
            <div className="text-sm text-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100">
              {selectedOption.label}
            </div>
            <div
              className={`absolute top-0 right-0 left-0 transition-transform duration-300  ${
                isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              } transform origin-top bg-white border border-gray-300 mt-1 py-2 rounded-lg`}
            >
              {options?.map((option) => (
                <div
                  key={option.value}
                  className={`p-1 hover:bg-gray-100 cursor-pointer flex flex-col justify-items-start ${
                    selectedOption.value == option.value && "bg-gray-100"
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <p className={`text-sm`}>{option.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default InitialResponseLabel;
