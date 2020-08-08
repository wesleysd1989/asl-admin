import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { useField } from '@rocketseat/unform';

const CurrencyInput = ({ label, name, ...rest }) => {
  const ref = useRef(null);
  const { fieldName, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'state.value',
      clearValue: pickerRef => {
        pickerRef.clear();
      },
    });
	}, [ref.current, fieldName]); // eslint-disable-line

  return (
    <>
      {label && <label htmlFor={fieldName}>{label}</label>}
      <NumberFormat
        name={fieldName}
        thousandSeparator=","
        decimalSeparator="."
        decimalScale={2}
        placeholder="R$ "
        prefix="R$ "
        ref={ref}
        {...rest}
      />
      {error && <span>{error}</span>}
    </>
  );
};

CurrencyInput.defaultProps = {
  label: '',
  name: '',
};

CurrencyInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
};

export default CurrencyInput;
