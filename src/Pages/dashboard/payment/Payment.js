import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {loadStripe} from '@stripe/stripe-js';
import CheckOut from '../checkOut/CheckOut';
import { Elements } from '@stripe/react-stripe-js';
const Payment = () => {
    const {appointmentId} = useParams();
    const [appointment,setAppointment] = useState({});
    useEffect(()=>{
        fetch(`https://whispering-river-98579.herokuapp.com/appointment/${appointmentId}`)
        .then(res => res.json())
        .then(data => setAppointment(data))
    },[appointmentId]);
    const stripePromise = loadStripe('pk_test_51KtZVrFmKu5Rjsf6NvbpLoZN9OzYewh4k9OgqGK1RYUQ2GicofIj4CgzPUey1G85KQGqUEKLWiMZFuUVMIxJFnWX00pHXmY0cB')
    return (
        <div>
            <h3>Please Pay For : {appointment.patientName} For {appointment.serviceName}</h3>
            <h4>Pay ${appointment.price}</h4>
             {
                 appointment?.price && <Elements stripe={stripePromise}>
                 <CheckOut
                 appointment={appointment}
                 ></CheckOut>
             </Elements>
             }
        </div>
    );
};

export default Payment;

/*
1. install stripe and stripe-react
2. set publishable key
3. Elements
4. checkout form
--------
5. create payment method
6. server create payment intent api
7. load client secret
8. confirm card payment
9. handle user error 

*/