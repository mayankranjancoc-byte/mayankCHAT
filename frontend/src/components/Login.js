import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    navigate(`/chat/${name}`);
  };

  return (
    <>
      <header className="head">
        <h1>mayankCHAT</h1>
      </header>

      <div className="form-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter a username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button type="submit">Join</button>
        </form>
      </div>
    </>
  );
};

export default Login;
