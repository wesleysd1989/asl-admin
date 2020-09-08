import React, { useState, useEffect } from 'react';
import { Form, Input, Select } from '@rocketseat/unform';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import debounce from 'lodash/debounce';
import { useParams } from 'react-router-dom';

import history from '../../services/history';
import api from '../../services/api';
import { Table, Modal } from '../../components';

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  commemorative_id: Yup.string().required('Commemorative date is required'),
  status: Yup.number().required('Status is required'),
});

const Event = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadTable, setLoadTable] = useState(false);
  const [disabledForm, setDisabledForm] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [query, setQuery] = useState('');
  const [formdata, setFormdata] = useState({});
  const [employees, setEmployees] = useState([]);
  const [commemorativeList, setCommemorativeList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pageActive, setPageActive] = useState(1);
  const [idToDelete, setIdToDelete] = useState(0);

  const statusEvent = [
    { id: 1, title: 'ACTIVE' },
    { id: 2, title: 'PENDING' },
    { id: 3, title: 'DELETED' },
    { id: 4, title: 'BLOCKED' },
    { id: 5, title: 'FINISHED' },
  ];

  const updateStatusEvent = [
    { id: 1, title: 'ACTIVE' },
    { id: 2, title: 'PENDING' },
    { id: 3, title: 'DELETED' },
    { id: 4, title: 'BLOCKED' },
  ];

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${id}`);
      const res = await api.get(`/commemoratives`);
      const selectCommemoratives = res.data.commemoratives.map(
        commemorative => {
          return { id: commemorative.id, title: commemorative.name };
        },
      );
      const status = statusEvent.find(
        status => status.title === response.data.event.status,
      );
      setDisabledForm(status.title !== 'PENDING');
      setFormdata({
        name: response.data.event.name,
        commemorative_id: 2,
        status: status.id,
      });
      setCommemorativeList(selectCommemoratives);
    } catch (error) {
      toast.error('Could not access event information.');
      history.push('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async page => {
    setLoadTable(true);
    setPageActive(page);
    const response = await api.get(
      `/employees/${id}?page=${page}&qtdPage=${perPage}&search=${query}`,
    );
    setEmployees(response.data.employees);
    setTotalRows(response.data.total);
    setLoadTable(false);
  };

  useEffect(() => {
    fetchEvent();
    fetchEmployees(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async data => {
    try {
      const imageCommemorative = await api.get(
        `/commemoratives/${parseFloat(data.commemorative_id)}`,
      );
      const body = {
        name: data.name,
        commemorative_id: parseFloat(data.commemorative_id),
        image_id: imageCommemorative.data.commemorative.image[0].id || 1,
        status: updateStatusEvent[data.status - 1].title,
      };
      await api.put(`/events/${id}`, body);
      history.push('/events');
      toast.success('Event successfully updated.');
    } catch (error) {
      toast.error('It was not possible to update an event.');
    }
  };

  const toggle = () => {
    setShowModal(!showModal);
  };

  const handlePageChange = page => {
    fetchEmployees(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoadTable(true);
    setPageActive(page);
    const response = await api.get(
      `/employees/${id}?page=${page}&qtdPage=${newPerPage}&search=${query}`,
    );
    setEmployees(response.data.employees);
    setPerPage(newPerPage);
    setLoadTable(false);
  };

  const debouncedFn = debounce(async input => {
    setQuery(input);
    setLoadTable(true);
    const response = await api.get(
      `/employees/${id}?page=1&qtdPage=${perPage}&search=${input}`,
    );
    setEmployees(response.data.employees);
    setTotalRows(response.data.total);
    setLoadTable(false);
  }, 500);

  const onChange = event => {
    const input = event.target.value.toLowerCase();
    debouncedFn(input);
  };

  const deleteEvent = async () => {
    try {
      const response = await api.delete(`/employees/${idToDelete}`);
      const newList = await api.get(
        `/employees/${id}?page=${pageActive}&qtdPage=${perPage}&search=${query}`,
      );
      setEmployees(newList.data.employees);
      if (response.data.message === 'Employee deleted successfully.') {
        toast.success('Employee successfully deleted.');
      }
    } catch (error) {
      toast.error('It was not possible to delete employee.');
    }
  };

  const contentModaldelete = () => (
    <div>
      Do you really want to delete an employee?
      <br />
      <b>Note:</b> once deleted it will not be possible to reverse the deletion.
    </div>
  );

  const columns = [
    {
      name: 'ID',
      selector: 'id',
      sortable: false,
    },
    {
      name: 'Full Name',
      selector: 'full_name',
      sortable: false,
    },
    {
      name: 'Email',
      selector: 'email',
      sortable: false,
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: false,
    },
    {
      name: 'Actions',
      selector: 'actions',
      sortable: false,
      cell: row => (
        <div>
          <Button
            color="danger"
            onClick={() => {
              setIdToDelete(row.id);
              toggle();
            }}
          >
            <i className="fa fa-trash" />
          </Button>
        </div>
      ),
    },
  ];

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
                  <strong>Update events</strong>
                </CardHeader>
                <CardBody>
                  {!loadTable ? (
                    <>
                      <Form
                        schema={schema}
                        onSubmit={handleSubmit}
                        initialData={formdata}
                      >
                        <div className="input-form">
                          <Input
                            label="Name"
                            name="name"
                            type="text"
                            placeholder="Name of event"
                            disabled={disabledForm}
                            required
                          />
                        </div>
                        <Row>
                          <Col xs="12" md="3">
                            <div className="input-form">
                              <Select
                                label="Commemorative date"
                                name="commemorative_id"
                                options={commemorativeList}
                                disabled={disabledForm}
                                required
                              />
                            </div>
                          </Col>
                          <Col xs="12" md="3">
                            <div className="input-form">
                              <Select
                                label="Status"
                                name="status"
                                options={
                                  disabledForm ? statusEvent : updateStatusEvent
                                }
                                disabled={disabledForm}
                              />
                            </div>
                          </Col>
                        </Row>
                        <div className="button-submit">
                          <Button color="primary" disabled={disabledForm}>
                            Update event
                          </Button>
                        </div>
                      </Form>
                      <div className="button-submit">
                        <Button
                          color="success"
                          onClick={() => {
                            history.push('/events');
                          }}
                        >
                          Back
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div>
                      <b>Loading...</b>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          )}
        </Row>
      </div>
      <Table
        title="History of employees send"
        placeholderInput="search by e-mail"
        onChange={onChange}
        columns={columns}
        data={employees}
        loading={loadTable}
        totalRows={totalRows}
        handlePerRowsChange={handlePerRowsChange}
        handlePageChange={handlePageChange}
      />

      <Modal
        showModal={showModal}
        confirmButton={() => {
          toggle('delete');
          deleteEvent();
        }}
        cancelButton={() => {
          toggle('delete');
        }}
        title="Delete event"
        content={contentModaldelete}
        firstBtnTitle="Delete"
        secondBtnTitle="Cancel"
      />
    </div>
  );
};

export default Event;
