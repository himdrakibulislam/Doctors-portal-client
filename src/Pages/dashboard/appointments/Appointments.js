import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';

const Appointments = ({date}) => {
    const {user,token} = useAuth();
    const [appointments,setAppointments] = useState([]);
    let { url } = useRouteMatch();
    useEffect(()=>{
        const url = `https://whispering-river-98579.herokuapp.com/appointments?email=${user.email}&date=${date.toLocaleString().slice(0,9)}`
        fetch(url,{
          headers:{
            'authorization':`Bearer ${token}`
          }
        })
        .then(res => res.json())
        .then(data =>setAppointments(data))
    },[date,user.email,token]);
    return (
        <div>
            <h3>Appointments {appointments.length}</h3>
            <p>{date.toDateString()}</p>
            <TableContainer component={Paper}>
      <Table sx={{ }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Time</TableCell>
            <TableCell align="right">Service</TableCell>
            <TableCell align="right">Payment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((row) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.patientName}
              </TableCell>
              <TableCell align="right">{row.serviceName}</TableCell>
              <TableCell align="right">{row.time}</TableCell>
              <TableCell align="right">{row.payment? 'Paid':<Link to={`${url}/payment/${row._id}`}><button>Pay</button></Link>}</TableCell>
             
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </div>
    );
};

export default Appointments;