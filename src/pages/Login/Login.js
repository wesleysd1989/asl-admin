import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from '@rocketseat/unform';
import { Button } from 'reactstrap';
import * as Yup from 'yup';

import { signInRequest } from '../../store/modules/auth/actions';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Enter a valid email')
    .required('E-mail is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);
  const handleSubmit = ({ email, password }) => {
    dispatch(signInRequest(email, password));
  };

  return (
    <div className="login">
      <div className="content">
        <Form schema={schema} onSubmit={handleSubmit}>
          <h1 className="mb-4 text-center">Login</h1>
          <Input name="email" type="text" placeholder="E-mail" />
          <Input name="password" type="password" placeholder="Password" />
          <Button color="primary" block>
            {loading ? 'Loading ...' : 'Login'}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
