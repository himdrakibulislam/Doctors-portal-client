import { CircularProgress } from '@mui/material';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth'
const CheckOut = ({appointment}) => {
  const {price,patientName,_id} = appointment;
  const [err,setErr] = useState('');
  const [clientSecrate,setClientSecrate] = useState('');
  const [success,setSuccess] = useState('');
  const [processing,setProcessing] = useState(false);
  const {user} = useAuth();
  useEffect(()=>{
    fetch('http://localhost:5000/create-payment-intent',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({price}) 
    }).then(res =>res.json())
    .then(data => setClientSecrate(data.clientSecrate))
  },[price])
    const handleSubmit = async(e) =>{
        e.preventDefault();
        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
          }
          const card = elements.getElement(CardElement);

          if (card == null) {
            return;
          }
           // Use your card Element with other Stripe.js APIs
          const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card,
          });
          if (error) {
            console.log('[error]', error);
            setSuccess('')
            setErr(error.message);
          } else {
            setErr('')
            console.log('[PaymentMethod]', paymentMethod);
          }
          // paymentIntent 
          setProcessing(true);
          const {paymentIntent, error:intentError} = await stripe.confirmCardPayment(
            clientSecrate,
            {
              payment_method: {
                card: card,
                billing_details: {
                  name: patientName,
                  email:user.email
                },
              },
            },
          );
          if(intentError){
            setErr(intentError.message);
          }else{
            setErr('');
            setSuccess('Payment Syccessful');
            setProcessing(false);
            // save to databse
            const url = `http://localhost:5000/appointmentpayment/${_id}`;
            const payment = {
              amount: paymentIntent.amount,
              created:paymentIntent.created
            }
            fetch(url,{
              method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(payment)
            }).then(res => res.json())
            .then(data =>{})
          }
    }
    const stripe = useStripe();
    const elements = useElements();
    return (
        <div>
            <h3>Check Out</h3>
            <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      {
        processing?<CircularProgress></CircularProgress>:<button type="submit" disabled={!stripe ||success}>
        Pay ${price}
      </button>
      }
    </form>
    {
      err && <p style={{color:'red'}}>{err}</p>
    }
    
    {
    success && <p style={{color:'green'}}>{success}</p>
    }
        </div>
    );
};

export default CheckOut;