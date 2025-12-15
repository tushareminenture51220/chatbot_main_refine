import { useWorkFlowContextData } from "@/context/WorkFlowContext";
import { useEffect, useState } from "react";
import { useReactFlow } from "reactflow";

const AskAQuestion = () => {
  const [config, setConfig] = useState({
    responseText: "",
    validationType: "",
    errorMessage: "",
    retryAttempts: 2,
  });
  const { isActiveBottomTRForm, nextActionDelayTime, setNextActionDelayTime } =
    useWorkFlowContextData();
  const { setNodes } = useReactFlow();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setNodes((nds) =>
      nds.map((node) =>
        node.id === isActiveBottomTRForm.id
          ? {
              ...node,
              data: { ...node.data, message: config, nextActionDelayTime },
            }
          : node
      )
    );
    //  console.log("Form Data:", config);
  };

  useEffect(() => {
    const message = isActiveBottomTRForm?.activeNode?.data?.message;

    setConfig(message);
    setNextActionDelayTime(
      isActiveBottomTRForm?.activeNode?.data?.nextActionDelayTime
    );
    console.log(
      "isActiveBottomTRForm",
      isActiveBottomTRForm?.data?.message?.responseText
    );
  }, [isActiveBottomTRForm]);

  return (
    <div className="max-w-md mx-auto px-4 py-6 border rounded shadow bg-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="block text-sm text-gray-700 font-semibold">
          Ask a question for the user
        </p>
        <div className="grid items-center border-b border-blue-500 py-2 ">
          <textarea
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            name="responseText"
            value={config?.responseText}
            onChange={handleChange}
            placeholder="What would you like to ask?"
            required
          />
        </div>
        <div>
          <label
            htmlFor="validationType"
            className="block text-sm font-medium text-gray-700"
          >
            Select validation type
          </label>
          <div className="relative mt-1">
            <select
              name="validationType"
              id="validationType"
              value={config?.validationType}
              onChange={handleChange}
              className="block w-full border border-blue-300 rounded-md shadow-sm p-2 appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option className="flex items-start gap-2" value="Name">
                <span> Name</span>
              </option>
              <option className="flex items-start gap-2" value="Email">
                <span>Email</span>
              </option>
              <option className="flex items-start gap-2" value="Phone Number">
                <span>Phone Number</span>
              </option>
            </select>
          </div>
        </div>
        <div>
          <label
            htmlFor="errorMessage"
            className="block text-sm font-medium text-gray-700"
          >
            Enter the message displayed to visitor when there is a validation
            error
          </label>
          <input
            type="text"
            name="errorMessage"
            value={config?.errorMessage}
            onChange={handleChange}
            placeholder="Enter the validation message"
            className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm p-2 appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="retryAttempts"
            className="block text-sm font-medium text-gray-700"
          >
            Number of repeats
          </label>
          <input
            type="number"
            name="retryAttempts"
            value={config?.retryAttempts}
            onChange={handleChange}
            min="1"
            className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm p-2 appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            maxLength={1}
            onInput={(e) => {
              if (e.target.value.length > 1) {
                e.target.value = e.target.value.slice(0, 1);
              }
            }}
            required
          />
        </div>
        <button
          type="submit"
          className="text-blue-700 w-full hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
};

export default AskAQuestion;
