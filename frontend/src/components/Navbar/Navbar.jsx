import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/frontend_assets/assets'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'


const Navbar = ({ setShowLogin }) => {
 const [menu, setMenu] = useState("")
 const {getTotalCartAmount, token, setToken} = useContext(StoreContext)
const navigate = useNavigate();

 const logout = () => {
  localStorage.removeItem("token")
  setToken("")
    navigate("/")
 }


  return (
    <div className='navbar'>
        <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>
        <ul className="navbar-menu">
            <Link  to='/' className={menu === "Home" ? "active" : ""} onClick={() => setMenu("Home")}>Home</Link>
            <a href='#explore-menu' className={menu === "Menu" ? "active" : ""} onClick={() => setMenu("Menu")}>Menu</a>
            <a href='#app-download' className={menu === "Mobile-app" ? "active" : ""} onClick={() => setMenu("Mobile-app")}>Mobile-app</a>
            <a href='#footer' className={menu === "Contact us" ? "active" : ""} onClick={() => setMenu("Contact us")}>Contact us</a>
        </ul>
        <div className="navbar-right">
            <img src={assets.search_icon} alt="" />
            <div className="navbar-search-icon">
               <Link to="/cart"> <img src={assets.basket_icon} alt="" /></Link>
                <div className={getTotalCartAmount()===0? "" : "dot"}></div>
            </div>
            {!token ? (
              <button onClick={()=>setShowLogin(true)}>Sign In</button>
            ) : (
              <div className='navbar-profile'>
                <img src={assets.profile_icon} alt="" /> 
                <ul className="navbar-profile-dropdown">
                  <li onClick={()=>navigate("/myorders")}><img src={assets.bag_icon} alt="" />
                  <p>Orders</p></li>
                  <hr />
                  <li onClick={logout}><img src={assets.logout_icon} alt="" />
                  <p>Logout</p></li>
                </ul>
              </div>
            )}
        </div>

        </div>
  )
}

export default Navbar