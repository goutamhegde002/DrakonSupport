// components/UserAvatar.jsx
import React from "react";
import { User } from "lucide-react";

const UserAvatar = () => {
  return (
    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
      <User className="w-5 h-5 text-blue-600" />
    </div>
  );
};

export default UserAvatar;
