import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/frontend_assets/assets'

const LoginPopup = ({setShowLogin}) => {
   const [currentState, setCurrentState] = useState("sign up")

  return (
    <div className="login-popup"> 
    <form  className="login-popup-container">
      <div className="login-poup-title">
        <h2>{currentState}</h2>
        <img onClick={()=> setShowLogin(false)} src={assets.cross_icon} alt="" />

      </div>
      <div className="login-popup-inputs">
        <input type="text"  placeholder='Your name ' required />
        <input type="email"  placeholder='Your email ' required />
        <input type='password' placeholder='' required />
      </div>
      <button>{currentState === "sign up" ? "Create Account" : "Login"}</button>


    </form>
        
</div>  )
}

export default LoginPopup