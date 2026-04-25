import React, { useCallback, useEffect } from 'react'
import "./Verify.css"
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';



const Verify = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const {url} = useCallback(StoreContext);
    const navigate = useNavigate();
    
    const verifyPayment = async () => {
        const response = await axios.post(url + "/api/order/verify", { orderId, success });
        if (response.data.success) {
            // Payment verified successfully
            navigate("/myorders");
        }
        else{
            // Payment verification failed
            navigate("/");
        }
    };

useEffect(()=>{
    verifyPayment();
}, [])
    

  return (
    <div>
        <div className="verify">
            <div className="spinner">

            </div>
        </div>
    </div>
  )
}

export default Verify