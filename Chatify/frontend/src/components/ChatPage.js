import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const ChatPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [typingUser, setTypingUser] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const [onlineUsers, setOnlineUsers] = useState([]);

  // 1️⃣ Send join event when user enters page
  useEffect(() => {
    socket.emit("join", username);
  }, [username]);

  // 2️⃣ Listen for incoming messages
  useEffect(() => {
    socket.on("message", (data) => {
      console.log("📥 received message:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  // 3️⃣ Listen for typing and stopTyping
  useEffect(() => {
    socket.on("typing", (name) => {
      setTypingUser(name);
    });

    socket.on("stopTyping", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  // 4️⃣ Listen for online users list
  useEffect(() => {
    socket.on("onlineUsers", (list) => {
      console.log("📡 updated online users:", list);
      setOnlineUsers(list);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, []);

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (!isTyping) {
      socket.emit("typing", username);
      setIsTyping(true);
    }

    // reset timer each time user types
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping");
      setIsTyping(false);
      typingTimeoutRef.current = null;
    }, 1000);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const msgData = {
      username,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    console.log("📤 sending message:", msgData);
    socket.emit("message", msgData);
    setMessage("");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    socket.emit("stopTyping");
    setIsTyping(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      {/* Logout */}
      <a className="logout-link" onClick={handleLogout}>
        Logout
      </a>

      {/* Header */}
      <div className="header">
        <h2>mayankCHAT</h2>
        <p>Chatting as {username}</p>
      </div>

      {/* Online users list */}
      <div className="online-users">
        <h3>Online Users</h3>
        <ul>
          {onlineUsers.map((u, i) => (
            <li key={i}>{u}</li>
          ))}
        </ul>
      </div>

      {/* Typing indicator */}
      {typingUser && typingUser !== username && (
        <div className="typing-indicator">
          {typingUser} is typing…
        </div>
      )}

      {/* Message list */}
      <div className="chat-container">
        {messages.map((m, i) => {
          const mine = m.username === username;
          return (
            <div key={i} className={mine ? "my-chat" : "notmy-chat"}>
              <span className="user">
                {m.username} • {m.time}
              </span>
              <span className="msg">{m.text}</span>
            </div>
          );
        })}
      </div>

      {/* Input box */}
      <div className="chatbox-container">
        <form className="chatbox" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={handleInputChange}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
};

export default ChatPage;
