// ActionProvider.js
class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleApiResponse(response) {
    const message = this.createChatBotMessage(response.response, {
      withAvatar: true,
      delay: 500,
    });

    this.updateChatbotState(message);
  }

  handleError(error) {
    const message = this.createChatBotMessage(
      "I'm sorry, I encountered an error. Please try again.",
      {
        withAvatar: true,
        delay: 500,
      }
    );

    this.updateChatbotState(message);
  }

  updateChatbotState(message) {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  }
}

export default ActionProvider;
