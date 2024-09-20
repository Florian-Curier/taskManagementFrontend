import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import React, { useState } from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';

interface DateTimePickerComponentProps {
  value: Moment | null;
  onChange: (newValue: Moment | null) => void;
}

const DateTimePickerComponent: React.FC<DateTimePickerComponentProps> = ({ value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateTimePicker
        label="Sélectionner une date et une heure"
        value={value}
        onChange={onChange}
      />
    </LocalizationProvider>
  );
};

export default DateTimePickerComponent;