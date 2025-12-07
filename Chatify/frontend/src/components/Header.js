import React from 'react'
import '../App.css';

const Header = () => {
  return (
    <div className='head'>
    <img className='icon' src='../logo.png' alt="Chatify Logo" />
    <h1>mayankCHAT</h1>
  </div>  
  )
}

<div className="online-users">
  <h3>Online Users</h3>
  <ul>
    {onlineUsers.map((u, i) => (
      <li key={i}>{u}</li>
    ))}
  </ul>
</div>


export default Header