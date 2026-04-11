

import React from "react";

import Navbarr from "./Components/Navbar/Navbarr";
import Sidebar from "./Components/Sidebar/Sidebar";





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