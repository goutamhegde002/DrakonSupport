// App.jsx
import React, { useEffect, useState, useMemo } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import { Filter } from "lucide-react";

import config from "./config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";
import SearchBar from "./components/SearchBar";

const ChatbotComponent = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'user', 'bot', 'system'

  useEffect(() => {
    // Load chat history on component mount
    const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    setChatHistory(history);

    // Add event listener for storage changes
    const handleStorageChange = () => {
      const updatedHistory = JSON.parse(
        localStorage.getItem("chatHistory") || "[]"
      );
      setChatHistory(updatedHistory);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const filteredHistory = useMemo(() => {
    return chatHistory
      .filter((item) => {
        // Filter by type
        if (filterType !== "all" && item.type !== filterType) {
          return false;
        }

        // Filter by search query
        if (!searchQuery) return true;

        const searchLower = searchQuery.toLowerCase();
        return (
          item.message.toLowerCase().includes(searchLower) ||
          (item.intent && item.intent.toLowerCase().includes(searchLower))
        );
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [chatHistory, searchQuery, filterType]);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all chat history?")) {
      localStorage.removeItem("chatHistory");
      setChatHistory([]);
    }
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(chatHistory, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `chat_history_${new Date().toISOString()}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Customer Service Chat</h2>
        <div className="flex gap-2">
          <button
            onClick={exportHistory}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Export History
          </button>
          <button
            onClick={clearHistory}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear History
          </button>
        </div>
      </div>

      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />

      {chatHistory.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Chat History</h3>

          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <div className="flex gap-2 mb-4">
            {["all", "user", "bot", "system"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded capitalize ${
                  filterType === type
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredHistory.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded ${
                  item.type === "user"
                    ? "bg-blue-100"
                    : item.type === "bot"
                    ? "bg-gray-100"
                    : "bg-red-100"
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-semibold capitalize">{item.type}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2">{item.message}</p>
                {item.intent && (
                  <p className="text-sm text-gray-500 mt-1">
                    Intent: {item.intent} (Confidence:{" "}
                    {(item.confidence * 100).toFixed(1)}%)
                  </p>
                )}
              </div>
            ))}
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No messages found matching your search criteria
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotComponent;
