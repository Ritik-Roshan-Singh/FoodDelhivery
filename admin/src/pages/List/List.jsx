import React from 'react'
import './List.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';


const List = ({ url }) => {
    const [list, setList] = useState([]);
    const fetchList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            
            
            if(response.data.success){
                setList(response.data.data);
            }
            else{
                toast.error(response.data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch list');
        }
    }
    useEffect(() => {
        fetchList();
    }, []);
      //remove food item

      const removeItem = async(foodId) => {
        const response = await axios.post(`${url}/api/food/remove`, {id: foodId});
        await fetchList();
        if(response.data.success){
            toast.success(response.data.message);
        }
        else{
            toast.error(response.data.message);
        }
      }


  return (
    <div className='list add flex-col'>
        <p>All Food List</p>
        <div className="list-table">
            <div className="list-table-formate title">
               <b>Image</b><b>Name</b><b>Category</b><b>Price</b><b>Actions</b>

            </div>
            {list.map((item, index) => {
                return(
                    <div className="list-table-formate" key={index}>
                        <img src={`${url}/images/${item.image}`} alt={item.name} />
                        <p>{item.name}</p>
                        <p>{item.category}</p>
                        <p>{item.price}</p>
                        <p onClick={()=>removeItem(item._id)} className='cursor'>X</p>
                    </div>
                )
            })}

        </div>
       

    </div>
  )
}

export default List