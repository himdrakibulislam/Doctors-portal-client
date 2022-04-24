import { Grid } from '@mui/material';
import React from 'react';
import Calendar from '../../Shared/Calendar/Calendar';
import Appointments from '../appointments/Appointments';
const DashboardHome = () => {
  const [date, setDate] = React.useState(new Date());

    return (
        <div>
            <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Calendar
          date={date}
          setDate={setDate}
          ></Calendar>
        </Grid>
        <Grid item xs={12} md={6}>
            <Appointments
            date={date}
            ></Appointments>
        </Grid>
        </Grid>
        </div>
    );
};

export default DashboardHome;