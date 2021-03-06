import { Container, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Doctor from '../doctor/Doctor';

const Doctors = () => {
    const [doctors,setDoctors] = useState([]);
    useEffect(()=>{
        fetch('https://whispering-river-98579.herokuapp.com/doctors')
        .then(res => res.json())
        .then(data => setDoctors(data))
    },[])

    return (
        <div>
            <h1>Our Doctors</h1>
            <Container>
            <Grid container spacing={2}>
               {
                   doctors.map(doctor => <Doctor
                   key={doctor._id}
                   doctor={doctor}
                   >
                   </Doctor>)
               }
                </Grid>
            </Container>
        </div>
    );
};

export default Doctors;