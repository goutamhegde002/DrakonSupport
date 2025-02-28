// components/BotAvatar.jsx
import React from "react";
import { Bot } from "lucide-react";

const BotAvatar = () => {
  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
      <Bot className="w-5 h-5 text-gray-600" />
    </div>
  );
};

export default BotAvatar;
