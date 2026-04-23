import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category}) => {

  const { food_list } = useContext(StoreContext)

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>

      <div className="food-display-list">
  {food_list?.filter(Boolean).map((item, index) => {
    // Defensive checks: skip invalid items
    if (!item || !item._id) return null;
    // Only render items matching the selected category (or all)
    if (category === "All" || category === item.category) {
      return (
        <FoodItem
          key={item._id}
          id={item._id}
          name={item.name}
          description={item.description}
          price={item.price}
          image={item.image}
        />
      );
    }
    return null;
  })}
</div>

    </div>
  )
}

export default FoodDisplay