import "./App.css";
import { useState } from "react";
import React from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [chatHistroy, setChatHistroy] = useState([]);
  const [currentTopic, setCurrentTopic] = useState("");
  const [currentChat, setCurrentChat] = useState([]);
  const [topics, setTopics] = useState([]);

  const createNewChat = () => {
    setInput("");
    setCurrentTopic("");
    setCurrentChat([]);
  };

  const handleClick = (topic) => {
    setInput("");
    setCurrentTopic(topic);
    setCurrentChat(chatHistroy.filter((chat) => chat.topic === topic));
  };

  const handleInput = (e) => {
    setInput(e.target.value); // Update "input".
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // The most crucial function.
  const handleSubmit = async () => {
    let currentTopicData = currentTopic;
    if (!currentTopicData && input) {
      currentTopicData = input;
    }

    let chatHistroyData = chatHistroy;
    chatHistroyData.push({
      topic: currentTopicData,
      role: "user",
      content: input,
    });
    let currentChatData = chatHistroyData.filter(
      (chat) => chat.topic === currentTopicData
    );

    let messages = [];
    for (let i = 0; i < currentChatData.length; i++) {
      messages[i] = {
        role: currentChatData[i].role,
        content: currentChatData[i].content,
      };
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
      }),
    };

    console.log(options);
    try {
      const res = await fetch("/api/chat/completions", options);
      const data = await res.json();
      console.log(data);

      // Update "chatHistroy".
      chatHistroyData.push({
        topic: currentTopicData,
        role: "assistant",
        content: data.choices[0].message.content,
      });
      setChatHistroy(chatHistroyData);

      // Update "currentTopic".
      setCurrentTopic(currentTopicData);

      // Update "currentChat".
      currentChatData = chatHistroyData.filter(
        (chat) => chat.topic === currentTopicData
      );
      setCurrentChat(currentChatData);

      // Update "topics".
      setTopics(Array.from(new Set(chatHistroyData.map((chat) => chat.topic))));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {topics?.map((topic, index) => (
            <li key={index}>
              <p onClick={() => handleClick(topic)}>{topic}</p>
            </li>
          ))}
        </ul>
        <nav>
          <p>Made by Lin</p>
        </nav>
      </section>
      <section className="main">
        {!currentTopic && <h1>LinGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chat, index) => (
            <li key={index}>
              {chat.role === "user" && <p className="role">You</p>}
              {chat.role === "assistant" && <p className="role">AI</p>}
              <p>{chat.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => handleInput(e)}
              onKeyDown={handleKeyPress}
            />
            <div id="submit" onClick={handleSubmit}>
              ➢
            </div>
          </div>
          <p className="info">
            Get instant answers, find creative inspiration, learn something new.
          </p>
        </div>
      </section>
    </div>
  );
}
