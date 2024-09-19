import { fr, enUS } from 'date-fns/locale'; // Import the 'enUS' locale
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';

const DateTimePickerComponent = () => {
  const [dueDateTime, setDueDateTime] = useState<Date | null>(new Date());

  const handleDateChange = (newValue: Date | null) => {
    setDueDateTime(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label="Sélectionner une date et une heure"
        value={dueDateTime}
        onChange={handleDateChange}
    
      />
    </LocalizationProvider>
  );
};

export default DateTimePickerComponent;