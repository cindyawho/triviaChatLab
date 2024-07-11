import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import QUESTION_BANK from './questionBank'

const CHATBOT_USER_OBJ = {
  _id: 2,
  name: "React Native Chatbot",
  avatar: "https://media.istockphoto.com/id/1957053641/vector/cute-kawaii-robot-character-friendly-chat-bot-assistant-for-online-applications-cartoon.jpg?s=612x612&w=0&k=20&c=Uf7lcu3I_ZNQvjBWxlFenRX7FuG_PKVJ4y1Y11aTZUc=",
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [triviaNumber, setTriviaNumber] = useState(0);

  useEffect(() => {
    if (messages.length < 1) {
      // Add a "starting message" when chat UI first loads
      addBotMessage(
        "Hello, welcome to simple trivia! Say 'Yes' when you're ready to play!"
      );
    }
  }, []);

  const addNewMessage = (newMessages) => {
    setMessages((previousMessages) => {
      // console.log("PREVIOUS MESSAGES:", previousMessages);
      // console.log("NEW MESSAGE:", newMessages);
      return GiftedChat.append(previousMessages, newMessages);
    });
  };

  const addBotMessage = (text) => {
    addNewMessage([
      {
        _id: Math.round(Math.random() * 1000000),
        text: text,
        createdAt: new Date(),
        user: CHATBOT_USER_OBJ,
      },
    ]);
  };

  const respondToUser = (userMessages) => {
    // console.log(QUESTION_BANK);
    // console.log(userMessages)
    let userName = userMessages[0].user.name;
    let userText = userMessages[0].text.toLowerCase();
    // console.log("Recent user msg:", userText);

    if(userText == "yes" && triviaNumber === 0){
      addBotMessage(QUESTION_BANK[1].text);
      setTriviaNumber(1);
    } else if(triviaNumber === 0) {
      addBotMessage("Hello " + userName + ". Remember to text 'Yes' when you're ready.");
    }

    if(triviaNumber === 1 && correctAnswer(1, userText)) {
      addBotMessage("Correct!");
      setTriviaNumber(2);
      addBotMessage(QUESTION_BANK[2].text);
    } else if(triviaNumber === 1 && userText == "hint") {
      addBotMessage(QUESTION_BANK[1].hint);
    } else if(triviaNumber === 1) {
      addBotMessage("Nope sorry. Please try again. If you want a hint, type 'hint'");
    }

    if(triviaNumber === 2 && correctAnswer(2, userText)) {
      addBotMessage("Correct!");
      setTriviaNumber(3);
      addBotMessage(QUESTION_BANK[3].text);
    } else if(triviaNumber === 2 && userText == "hint") {
      addBotMessage(QUESTION_BANK[2].hint);
    } else if(triviaNumber === 2) {
      addBotMessage("Nope sorry. Please try again. If you want a hint, type 'hint'");
    }

    if(triviaNumber === 3 && correctAnswer(3, userText)) {
      addBotMessage("Correct!");
      setTriviaNumber(4);
      addBotMessage("CONGRATS! YOU BEAT THE GAME");
    } else if(triviaNumber === 3 && userText == "hint") {
      addBotMessage(QUESTION_BANK[3].hint);
    } else if(triviaNumber === 3) {
      addBotMessage("Nope sorry. Please try again. If you want a hint, type 'hint'");
    }

  };

  const onSend = useCallback((messages = []) => {
    addNewMessage(messages);
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => {
        onSend(messages);
        // Wait a sec before responding
        setTimeout(() => respondToUser(messages), 1000);
      }}
      user={{
        _id: 1,
        name: "Snap Scholar",
      }}
      renderUsernameOnMessage={true}
    />
  );
}

// Workaround to hide an unnessary warning about defaultProps
const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};


// Check if answer is in answer bank of given question
function correctAnswer(questionNumber, userAnswer){
  console.log(userAnswer);
  console.log(QUESTION_BANK[questionNumber].answer);
  return QUESTION_BANK[questionNumber].answer.find(
    (answerElem) => answerElem == userAnswer
  )
}