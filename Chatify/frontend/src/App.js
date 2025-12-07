import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ChatPage from "./components/ChatPage";
import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/chat/:username" element={<ChatPage />} />
    </Routes>
  );
};

export default App;
