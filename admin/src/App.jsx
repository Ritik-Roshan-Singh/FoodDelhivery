

import React from "react";

import Navbarr from "./components/Navbar/Navbarr";
import Sidebar from "./components/Sidebar/Sidebar";





function App() {
 return (
   <div>
     <Navbarr />
     <div className="sidebar-content">
     <Sidebar />
   </div>
   </div>
 );
}


export default App;