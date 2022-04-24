import { Alert, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
const MakeAnAdmin = () => {
    const [email,setEmail] = useState('');
    const [success,setSucess] = useState(false);
    const {token} = useAuth();
    const handleOnBlur = (e) =>{
        const value = e.target.value;
        setEmail(value)
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        const adminEmail = {email}
        fetch('https://whispering-river-98579.herokuapp.com/users/admin',{
            method:'PUT',
            headers: {
                'authorization':`Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(adminEmail)
        })
        .then(res => res.json())
        .then(data => {if(data.modifiedCount){
            setSucess(true);
        }})
    }
    
    console.log(email)
    return (
        <div>
            <h2>Make Admin</h2>
            <form onSubmit={handleSubmit}>
            <TextField sx={{width:'50%'}} type="email" onBlur={handleOnBlur} label="E-mail" variant="standard" />
            <Button type='submit' variant="contained">Make Admin</Button>
            </form>
            {success && <Alert severity="success">Made Admin successfully!</Alert>}
        </div>
    );
};

export default MakeAnAdmin;