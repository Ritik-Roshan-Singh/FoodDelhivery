import React, { useState, useContext } from "react";
import './LoginPopup.css'
import { assets } from '../../assets/frontend_assets/assets'
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const LoginPopup = ({setShowLogin}) => {
const {url, setToken} = useContext(StoreContext)

   const [currentState, setCurrentState] = useState("Login")
   const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
   })
   const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData((data) => {
        return {...data, [name]: value}
    })
  };

  //onlogin
  const onlogin = async (event) => {
    event.preventDefault()
    let newUrl = url;
    if(currentState === "Login"){
      newUrl += "/api/user/login"

  }
  else{
    newUrl += "/api/user/register"
  }
  //login or register user api call
  const response = await axios.post(newUrl, data);

  if(response.data.success){
    setToken(response.data.token)
    localStorage.setItem("token", response.data.token)
    setShowLogin(false)

  }
  else{
    alert(response.data.message)
  }


  };

  

  return (
    <div className="login-popup"> 
    <form onSubmit={onlogin} className="login-popup-container">
      <div className="login-poup-title">
        <h2>{currentState}</h2>
        <img onClick={()=> setShowLogin(false)} src={assets.cross_icon} alt="" />

      </div>
      <div className="login-popup-inputs">
        {currentState === "Login" ? <></>: <input type="text" name="name" value={data.name} onChange={onChangeHandler} placeholder='Your name ' required />
        }
        <input type="text" name="email" value={data.email} onChange={onChangeHandler}  placeholder='Your email ' required />
        <input type="password" name="password" value={data.password} onChange={onChangeHandler}  placeholder='Your password ' required />
      </div>
      <button type="submit">{currentState === "Sign Up" ? "Create Account" : "Login"}</button>
      <div className="login-popup-condition">
        <input type="checkbox" required/>

        <p>I agree to the terms & conditions</p>

      </div>
      {currentState === "Login" ?
      <p>Create a new account? <span onClick={()=>setCurrentState("Sign Up")}>Click here</span></p> :  <p>Already have an account? <span onClick={()=>setCurrentState("Login")}>Login here</span></p> }
      
     
    </form>
        
</div>  )
}

export default LoginPopup