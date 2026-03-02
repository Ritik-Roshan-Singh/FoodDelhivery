import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/frontend_assets/assets'

const ExploreMenu = ({category, setCategory}) => {
  return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Explore Our Menu</h1>
        <p className='explore-menu-test'>Choose from a diverse selection of dishes crafted with care and quality ingredients.</p>
        <div className="explore-menu-list">
            {menu_list.map((item, index) => {
                return(

                    <div onClick={() => setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} className="explore-menu-list-item" key={index} >
                    <img className={category===item.menu_name?"active":""} src={item.menu_image} alt={item.menu_name} />
                    
                    <p>{item.menu_name}</p>
                    </div>
                )
            })}
        </div>
        <hr />
    </div>
  )
}

export default ExploreMenu