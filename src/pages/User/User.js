import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Select } from '@rocketseat/unform';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import * as Yup from 'yup';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';

import api from '../../services/api';
import history from '../../services/history';

import { parseDateISO, formatDate } from '../../utils';

const schema = Yup.object().shape({
  type: Yup.number().required('Type is required'),
});

const types = [{ id: 1, title: 'Administrator' }];

const User = () => {
  const { id } = useParams();
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    type: '',
    birth: '2020-10-10',
  });
  const [loading, setLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/user/${id}`);
      setUser({
        name: response.data.user.name,
        email: response.data.user.account.email,
        phone: response.data.user.phone,
        type: response.data.user.type,
        birth: response.data.user.birth,
      });
    } catch (error) {
      toast.error('Could not access user information.');
      history.push('/');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleSubmit = async data => {
    try {
      const response = await api.put(`/users/${id}`, data);
      if (response.data.message === 'User updated successfully.') {
        toast.success('User updated successfully.');
        history.push('/accounts/users');
      }
    } catch (error) {
      toast.error('Could not update user information.');
      history.push('/');
    }
  };
  return (
    <div className="animated fadeIn">
      <div className="register">
        <Row>
          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100vh',
              }}
            >
              <span>Loading...</span>
            </div>
          ) : (
            <Col xs="12" sm="12">
              <Card>
                <CardHeader>
                  <strong>User profile</strong>
                </CardHeader>
                <CardBody>
                  <>
                    <Form
                      initialData={user}
                      schema={schema}
                      onSubmit={handleSubmit}
                    >
                      <div className="input-form">
                        <Input
                          label="Name"
                          name="name"
                          type="text"
                          placeholder="Full name"
                          disabled
                        />
                      </div>
                      <div className="input-form">
                        <Input
                          label="E-mail"
                          name="email"
                          type="text"
                          placeholder="E-mail"
                          required
                          disabled
                        />
                      </div>
                      <Row className="complement-info">
                        <Col xs="12" md="4">
                          <div className="input-form">
                            <label className="label-form" htmlFor="phone">
                              Telefone
                              <InputMask
                                maskChar={null}
                                mask="(99)999999999"
                                defaultValue={user.phone}
                                disabled
                              >
                                {() => (
                                  <Input
                                    name="phone"
                                    type="text"
                                    placeholder="Phone"
                                    id="phone"
                                    disabled
                                  />
                                )}
                              </InputMask>
                            </label>
                          </div>
                        </Col>
                        <Col xs="12" md="4">
                          <div className="input-form">
                            <Select label="Type" name="type" options={types} />
                          </div>
                        </Col>
                        <Col xs="12" md="4">
                          <div className="input-form">
                            <label className="label-form" htmlFor="birth">
                              Date of birth
                              <InputMask
                                maskChar={null}
                                mask="99/99/9999"
                                defaultValue={formatDate(
                                  parseDateISO(
                                    user.birth.substring(0, 10),
                                    'yyyy-MM-dd',
                                  ),
                                  'dd/MM/yyyy',
                                )}
                                disabled
                              >
                                {() => (
                                  <Input
                                    name="birth"
                                    type="text"
                                    placeholder="Date of birth - dd/mm/yyyy"
                                    disabled
                                  />
                                )}
                              </InputMask>
                            </label>
                          </div>
                        </Col>
                      </Row>
                      <div className="button-submit">
                        <Button color="primary">Update profile</Button>
                      </div>
                    </Form>
                    <div className="button-submit">
                      <Button
                        color="success"
                        onClick={() => {
                          history.push('/accounts/users');
                        }}
                      >
                        Back
                      </Button>
                    </div>
                  </>
                </CardBody>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default User;
