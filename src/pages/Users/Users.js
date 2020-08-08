import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Select } from '@rocketseat/unform';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import * as Yup from 'yup';
import InputMask from 'react-input-mask';
import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';

import history from '../../services/history';
import api from '../../services/api';
import { parseDateISO, formatDate, toNumber } from '../../utils';
import { signUpRequest } from '../../store/modules/auth/actions';
import { Table, Modal } from '../../components';

const types = [{ id: 1, title: 'Administrator' }];

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'At least 6 characters')
    .required('Password is required')
    .oneOf(
      [Yup.ref('confirmPassword'), null],
      'Passwords must be the same, please check.',
    ),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must be the same, please check.',
  ),
  phone: Yup.string()
    .min(13, 'Invalid phone')
    .required('Phone is required'),
  type: Yup.string().required('Type is required'),
  birth: Yup.string().required('Date is required'),
});

const Users = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loadTable, setLoadTable] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [query, setQuery] = useState('');
  const [pageActive, setPageActive] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showModalBlock, setShowModalBlock] = useState(false);
  const [idToDelete, setIdToDelete] = useState(0);
  const [idToBlock, setIdToBlock] = useState(0);
  const [statusUser, setStatusUser] = useState(false);

  const fetchUsers = async page => {
    setLoadTable(true);
    setPageActive(page);
    const response = await api.get(
      `/users?page=${page}&qtdPage=${perPage}&searchEmail=${query}`,
    );
    setData(response.data.users);
    setTotalRows(response.data.total);
    setLoadTable(false);
  };

  const handlePageChange = page => {
    fetchUsers(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoadTable(true);
    setPageActive(page);
    const response = await api.get(
      `/users?page=${page}&qtdPage=${newPerPage}&searchEmail=${query}`,
    );
    setData(response.data.users);
    setPerPage(newPerPage);
    setLoadTable(false);
  };

  const lockAccount = async id => {
    try {
      const response = await api.put(`/account/${id}`);
      const newList = await api.get(
        `/users?page=${pageActive}&qtdPage=${perPage}&searchEmail=${query}`,
      );
      setData(newList.data.users);
      if (response.data.message === 'Account blocked successfully.') {
        toast.success('User successfully blocked..');
      } else {
        toast.success('User successfully unlocked.');
      }
    } catch (error) {
      toast.error('Could not block user.');
    }
  };

  const deleteAccount = async id => {
    try {
      const response = await api.delete(`/account/${id}`);
      const newList = await api.get(
        `/users?page=${pageActive}&qtdPage=${perPage}&searchEmail=${query}`,
      );
      setData(newList.data.users);
      if (response.data.message === 'Account deleted successfully.') {
        toast.success('Account deleted successfully.');
      }
    } catch (error) {
      toast.error('Could not delete user.');
    }
  };

  useEffect(() => {
    fetchUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedFn = debounce(async input => {
    setQuery(input);
    setLoadTable(true);
    const response = await api.get(
      `/users?page=1&qtdPage=${perPage}&searchEmail=${input}`,
    );
    setData(response.data.users);
    setTotalRows(response.data.total);
    setLoadTable(false);
  }, 500);

  const onChange = event => {
    const input = event.target.value.toLowerCase();
    debouncedFn(input);
  };

  const toggle = howModal => {
    if (howModal === 'delete') {
      setShowModal(!showModal);
    } else {
      setShowModalBlock(!showModalBlock);
    }
  };

  const loading = useSelector(state => state.auth.loading);
  const { id } = useSelector(state => state.user.profile);
  const handleSubmit = data => {
    const newbirth = formatDate(
      parseDateISO(data.birth, 'dd/MM/yyyy'),
      'yyyy-MM-dd',
    );
    const newData = { ...data, birth: newbirth, type: toNumber(data.type) };
    const { name, email, password, phone, birth, type } = newData;
    dispatch(signUpRequest(name, email, password, phone, birth, type));
  };

  const formdata = {
    type: 1,
  };

  const columns = [
    {
      name: 'Name',
      selector: 'name',
      sortable: false,
    },
    {
      name: 'E-mail',
      selector: 'account.email',
      sortable: false,
    },
    {
      name: 'Status',
      selector: 'account.activeted',
      sortable: false,
      cell: row => (
        <div>{row.account.activeted ? 'Activated' : 'Not activated'}</div>
      ),
    },
    {
      name: 'Type',
      selector: 'type',
      sortable: false,
      cell: row => <div>{types[row.type - 1].title}</div>,
    },
    {
      name: 'Actions',
      selector: 'actions',
      sortable: false,
      cell: row => (
        <div>
          <Button
            color="danger"
            disabled={id === row.account.id}
            onClick={() => {
              setIdToDelete(row.account.id);
              toggle();
            }}
          >
            <i className="fa fa-trash" />
          </Button>
          <Button
            color="primary"
            disabled={id === row.account.id}
            onClick={() => {
              setIdToBlock(row.account.id);
              toggle('block');
              setStatusUser(row.account.blocked);
            }}
          >
            <i
              className={
                !row.account.blocked ? 'fa fa-lock' : 'fa fa-unlock-alt'
              }
            />
          </Button>
          <Button
            color="success"
            onClick={() => {
              if (id === row.account.id) {
                history.push('/profile');
              } else {
                history.push(`/accounts/user/${row.id}`);
              }
            }}
          >
            <i className="fa fa-wrench" />
          </Button>
        </div>
      ),
    },
  ];

  const contentModaldelete = () => (
    <div>
      Do you really want to delete user?
      <br />
      <b>Note:</b> once deleted it will not be possible to revert the deletion.
    </div>
  );

  const contentModalBlock = () => (
    <div>
      {!statusUser
        ? 'Do you really want to block this user?'
        : 'Do you really want to unblock this user?'}
      <br />
      <b>Note:</b> you can lock or unlock at any time.
    </div>
  );

  return (
    <div className="animated fadeIn">
      <div className="register">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>User registration</strong>
              </CardHeader>
              <CardBody>
                <Form
                  schema={schema}
                  onSubmit={handleSubmit}
                  initialData={formdata}
                >
                  <div className="input-form">
                    <Input
                      label="name"
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
                    />
                  </div>
                  <Row>
                    <Col xs="12" md="6">
                      <div className="input-form">
                        <Input
                          label="Password"
                          name="password"
                          type="password"
                          placeholder="Password"
                          required
                        />
                      </div>
                    </Col>
                    <Col xs="12" md="6">
                      <div className="input-form">
                        <Input
                          label="Confirm password"
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirme password"
                          required
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="complement-info">
                    <Col xs="12" md="4">
                      <div className="input-form">
                        <label className="label-form" htmlFor="phone">
                          Phone
                          <InputMask maskChar={null} mask="(99)999999999">
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
                          label="Account type"
                          name="type"
                          options={types}
                          required
                        />
                      </div>
                    </Col>
                    <Col xs="12" md="4">
                      <div className="input-form">
                        <label className="label-form" htmlFor="birth">
                          Date of birth
                          <InputMask maskChar={null} mask="99/99/9999">
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
                    <Button color="primary">
                      {loading ? 'Loading ...' : 'Sign in'}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      <Table
        title="Users"
        onChange={onChange}
        columns={columns}
        data={data}
        loading={loadTable}
        totalRows={totalRows}
        handlePerRowsChange={handlePerRowsChange}
        handlePageChange={handlePageChange}
      />
      <Modal
        showModal={showModal}
        confirmButton={() => {
          toggle('delete');
          deleteAccount(idToDelete);
        }}
        cancelButton={() => {
          toggle('delete');
        }}
        title="Delete user"
        content={contentModaldelete}
        firstBtnTitle="Delete"
        secondBtnTitle="Cancel"
      />
      <Modal
        showModal={showModalBlock}
        confirmButton={() => {
          toggle('block');
          lockAccount(idToBlock);
        }}
        cancelButton={() => {
          toggle('block');
        }}
        title={!statusUser ? 'Bloquear usuário' : 'Desbloquear usuário'}
        content={contentModalBlock}
        firstBtnTitle={!statusUser ? 'Bloquear' : 'Desbloquear'}
        secondBtnTitle="Cancelar"
      />
    </div>
  );
};

export default Users;
