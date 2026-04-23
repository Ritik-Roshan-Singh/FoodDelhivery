import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/frontend_assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = (props) => {
  // Destructure safely from props in case the component is ever rendered
  // with undefined or partial props. Provide simple fallbacks for UI.
  const { id, name = '', description = '', price = 0, image } = props || {};

  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

    // Build a safe base URL (remove any trailing slash) so we don't create
    // invalid URLs like "http://localhost:4000images/..." or with double slashes.
    const safeBase = (url || '').replace(/\/+$/, '');
    // Use a bundled placeholder (from assets) when the backend image is missing.
    const placeholder = assets.header_img;
    const imageSrc = image ? `${safeBase}/images/${image}` : placeholder;

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img
          className="food-item-img"
          src={imageSrc}
          alt={name}
          onError={(e) => {
            // Fallback to a local placeholder if the image fails to load
            e.currentTarget.onerror = null;
            e.currentTarget.src = placeholder;
          }}
        />
        {
      !(cartItems && cartItems[id])
      ? <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt='add' />
      : <div className="food-item-counter">
        <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />
        <p>{cartItems?.[id] ?? 0}</p>
        <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="" />
      </div>
        }
      </div>
         <div className="food-item-info">
            <div className="food-item-name-rating">
        <p>{name || 'Unnamed item'}</p>
                <img src={assets.rating_starts} alt="" />
            </div>
            <p className="food-item-desc">
        {description || 'No description available.'}
            </p>
            <p className="food-item-price">
        ${price}
            </p>
         </div>
        
        
    </div>
  )
}

export default FoodItem