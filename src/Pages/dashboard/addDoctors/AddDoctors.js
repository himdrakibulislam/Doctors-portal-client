import { Button, Input, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const AddDoctors = () => {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [image,setImage] = useState(null);
    const [success,setSuccsess] = useState(false);
    const history = useHistory()
    const handleSubmit = (e) => {
        e.preventDefault();
        if(!image){
            return
        }
        const formData = new FormData();
        formData.append('name',name);
        formData.append('email',email);
        formData.append('image',image);
        fetch('http://localhost:5000/doctors', {
            method: 'POST',
            body: formData
            })
            .then(res => res.json())
            .then(data => {
                if(data.insertedId){
                    setSuccsess('Doctor added');
                    history.replace('/')
                }
            })
            .catch(error => {
            console.error('Error:', error);
            });
    }
    return (
        <div>
            <h3>Add Doctors</h3>
            <form onSubmit={handleSubmit}>
            <TextField
            sx={{width:'50%'}}
              label="Name" 
              type='text'
              required
              onChange={e=>setName(e.target.value)}
              variant="standard" />

            <br />
            <TextField
            sx={{width:'50%'}}
            type='email'
            required
            onChange={e=>setEmail(e.target.value)}

              label="email" 
              variant="standard" />
              <br />
              <br />
              <Input accept="image/*" 
              type="file"
              onChange={e => setImage(e.target.files[0])}
              />
              <br />
              <br />
                <Button variant="contained" type='submit' >
                    Add Doctor
                </Button>
            </form>
            {
                success && <p style={{color:'green'}}>{success}</p>
            }
        </div>
    );
};

export default AddDoctors;