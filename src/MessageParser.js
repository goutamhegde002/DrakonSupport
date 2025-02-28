// MessageParser.js
class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    // Send message to backend API
    fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: message,
        order_number: null, // You can extract order number from message if needed
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.actionProvider.handleApiResponse(data);
      })
      .catch((error) => {
        this.actionProvider.handleError(error);
      });
  }
}

export default MessageParser;
