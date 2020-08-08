import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Select } from '@rocketseat/unform';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import * as Yup from 'yup';
import InputMask from 'react-input-mask';

import AvatarInput from './AvatarInput';
import { updateProfileRequest } from '../../store/modules/user/actions';
import { parseDateISO, formatDate, toNumber } from '../../utils';

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  oldPassword: Yup.string()
    .min(6, 'No mínimo 6 caracteres')
    .required('O password é obrigatório'),
  password: Yup.string().oneOf(
    [Yup.ref('confirmPassword'), null],
    'As senhas devem ser iguais, por favor verifique.',
  ),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'As senhas devem ser iguais, por favor verifique.',
  ),
  phone: Yup.string()
    .min(13, 'Telefone invalido')
    .required('O telefone é obrigatório'),
  birth: Yup.string().required('A data é obrigatório'),
  avatar_id: Yup.number(),
});

const types = [
  { id: 1, title: 'Administrador' },
  { id: 2, title: 'Contador' },
  { id: 3, title: 'Suporte' },
];

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const formdata = {
    name: user.profile.name,
    email: user.profile.email,
    phone: user.profile.phone,
    type: user.profile.type,
    birth: user.profile.birth,
    avatar: user.profile.avatar,
  };

  const handleSubmit = data => {
    const newbirth = formatDate(
      parseDateISO(data.birth, 'dd/MM/yyyy'),
      'yyyy-MM-dd',
    );
    const newData = { ...data, birth: newbirth, type: toNumber(data.type) };
    const {
      name,
      oldPassword,
      password,
      confirmPassword,
      phone,
      birth,
      avatar_id,
    } = newData;
    dispatch(
      updateProfileRequest(
        name,
        oldPassword,
        password,
        confirmPassword,
        phone,
        birth,
        avatar_id,
      ),
    );
  };
  return (
    <div className="animated fadeIn">
      <div className="register">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>Profile</strong>
              </CardHeader>
              <CardBody>
                <Form
                  initialData={formdata}
                  schema={schema}
                  onSubmit={handleSubmit}
                >
                  <Row>
                    <Col
                      xs="12"
                      sm="12"
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                      }}
                    >
                      <AvatarInput name="avatar_id" />
                    </Col>
                  </Row>
                  <div className="input-form">
                    <Input
                      label="Name"
                      name="name"
                      type="text"
                      placeholder="Full name"
                      required
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
                  <Row>
                    <Col xs="12" md="4">
                      <div className="input-form">
                        <Input
                          label="Password"
                          name="oldPassword"
                          type="password"
                          placeholder="Password"
                          required
                        />
                      </div>
                    </Col>
                    <Col xs="12" md="4">
                      <div className="input-form">
                        <Input
                          label="New password"
                          name="password"
                          type="password"
                          placeholder="New password"
                        />
                      </div>
                    </Col>
                    <Col xs="12" md="4">
                      <div className="input-form">
                        <Input
                          label="Confirm new password"
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="complement-info">
                    <Col xs="12" md="4">
                      <div className="input-form">
                        <label className="label-form" htmlFor="phone">
                          Phone
                          <InputMask
                            maskChar={null}
                            mask="(99)999999999"
                            defaultValue={user.profile.phone}
                          >
                            {() => (
                              <Input
                                name="phone"
                                type="text"
                                placeholder="Phone"
                                required
                                id="phone"
                              />
                            )}
                          </InputMask>
                        </label>
                      </div>
                    </Col>
                    <Col xs="12" md="4">
                      <div className="input-form">
                        <Select
                          label="Type"
                          name="type"
                          options={types}
                          required
                          disabled
                        />
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
                                user.profile.birth.substring(0, 10),
                                'yyyy-MM-dd',
                              ),
                              'dd/MM/yyyy',
                            )}
                          >
                            {() => (
                              <Input
                                name="birth"
                                type="text"
                                placeholder="Date of birth"
                                required
                              />
                            )}
                          </InputMask>
                        </label>
                      </div>
                    </Col>
                  </Row>
                  <div className="button-submit">
                    <Button color="primary">Update</Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Profile;
