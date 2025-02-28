# 🤖 DrakonSupport Chatbot

## 📋 Overview

DrakonSupport is a React-based customer service chatbot application designed to provide automated support for users. It leverages `react-chatbot-kit` to create an interactive chat experience with customizable components like BotAvatar, UserAvatar, and SearchBar.

## 🔧 Project Structure

```
drakonsupport/
├── backend/               # Server-side code
│   ├── app.py             # Python backend service
│   └── customer_service_data.csv  # Training data for responses
├── public/                # Static files
│   └── index.html         # HTML entry point
├── src/                   # React source code
│   ├── components/        # React components
│   │   ├── BotAvatar.jsx  # Custom bot avatar component
│   │   ├── SearchBar.jsx  # Search functionality
│   │   └── UserAvatar.jsx # Custom user avatar component
│   ├── ActionProvider.js  # Handles chatbot actions/responses
│   ├── App.jsx            # Main React component
│   ├── config.js          # Chatbot configuration
│   ├── index.css          # Global styles
│   ├── index.js           # React entry point
│   └── MessageParser.js   # Processes user messages
├── .gitignore             # Git ignore file
├── package-lock.json      # Dependency lock file
├── package.json           # Project dependencies and scripts
└── README.md              # Project documentation
```

## ✨ Features

- 💬 Interactive chat interface
- 🔍 Search functionality for quick access to information
- 👤 Custom avatar components for both bot and user
- 🔄 Message parsing and intelligent responses
- 🔌 Integration with a Python backend for advanced processing

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Python 3.7+ (for backend)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/goutamhegde002/drakonsupport.git
   cd drakonsupport
   ```

2. **Install frontend dependencies:**

   ```bash
   npm install
   ```

3. **Install required packages:**

   ```bash
   npm install react-chatbot-kit lucide-react
   ```

4. **Set up the Python backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the React frontend:**

   ```bash
   npm start
   ```

2. **Start the Python backend (in a separate terminal):**

   ```bash
   cd backend
   python app.py
   ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`

## 🛠️ Development

### Frontend Components

- **App.jsx**: Main component that integrates the chatbot
- **config.js**: Configuration for the chatbot including widgets and initial messages
- **MessageParser.js**: Handles parsing of user messages
- **ActionProvider.js**: Provides responses based on parsed messages

### Backend Integration

The Python backend (`app.py`) provides:

- Advanced NLP processing
- Integration with customer service data
- API endpoints for the React frontend

## 📦 Dependencies

- React
- react-chatbot-kit
- lucide-react (for icons)
- Flask (for backend)

## 🔮 Future Improvements

- 📱 Mobile responsiveness enhancements
- 🌐 Multi-language support
- 🧠 Advanced NLP integration
- 📊 Analytics dashboard
- 🔐 User authentication
- 🎨 Customizable themes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- React Chatbot Kit - [https://fredrikoseberg.github.io/react-chatbot-kit-docs/](https://fredrikoseberg.github.io/react-chatbot-kit-docs/)
- Lucide React Icons - [https://lucide.dev/](https://lucide.dev/)
