import React, { useRef, useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import propTypes from 'prop-types';
import { useField } from '@rocketseat/unform';

import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = ({ label, name }) => {
  const ref = useRef(null);
  const { fieldName, registerField, error } = useField(name);
  const [selected, setSelected] = useState(new Date());

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'props.selected',
      clearValue: pickerRef => {
        pickerRef.clear();
      },
    });
  }, [ref.current, fieldName]); // eslint-disable-line

  return (
    <>
      {label && <label htmlFor={fieldName}>{label}</label>}
      <ReactDatePicker
        name={fieldName}
        selected={selected}
        dateFormat="dd/MM/yyyy"
        locale={ptBR}
        onChange={date => setSelected(date)}
        ref={ref}
      />
      {error && <span>{error}</span>}
    </>
  );
};

DatePicker.propTypes = {
  label: propTypes.string,
  name: propTypes.string,
};

DatePicker.defaultProps = {
  label: '',
  name: '',
};

export default DatePicker;
