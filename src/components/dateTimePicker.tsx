import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import React, { useState } from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';
import 'moment/locale/fr';

interface DateTimePickerComponentProps {
  value: Moment | null;
  onChange: (newValue: Moment | null) => void;
}

const DateTimePickerComponent: React.FC<DateTimePickerComponentProps> = ({ value, onChange }) => {
  moment.locale('fr');

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateTimePicker
        label="Select a date and time"
        value={value}
        onChange={onChange}
        ampm={false} 
        minutesStep={1} 
        disablePast  
        format="DD/MM/YYYY HH:mm"  
      />
    </LocalizationProvider>
  );
};

export default DateTimePickerComponent;