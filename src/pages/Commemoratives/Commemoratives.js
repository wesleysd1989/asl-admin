import React, { useState, useEffect } from 'react';
import { Form, Input } from '@rocketseat/unform';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import * as Yup from 'yup';
import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import history from '../../services/history';
import api from '../../services/api';
import { Table, Modal, ImageUploading } from '../../components';

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
});

const maxNumber = 1;
const Commemoratives = () => {
  const [data, setData] = useState([]);
  const [loadTable, setLoadTable] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [query, setQuery] = useState('');
  const [pageActive, setPageActive] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(0);
  const [images, setImages] = useState([]);

  const fetchCommemoratives = async page => {
    setLoadTable(true);
    setPageActive(page);
    const response = await api.get(
      `/commemoratives?page=${page}&qtdPage=${perPage}&search=${query}`,
    );
    setData(response.data.commemoratives);
    setTotalRows(response.data.total);
    setLoadTable(false);
  };

  const handlePageChange = page => {
    fetchCommemoratives(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoadTable(true);
    setPageActive(page);
    const response = await api.get(
      `/commemoratives?page=${page}&qtdPage=${newPerPage}&search=${query}`,
    );
    setData(response.data.commemoratives);
    setPerPage(newPerPage);
    setLoadTable(false);
  };

  const deleteCommemorative = async id => {
    try {
      const response = await api.delete(`/commemoratives/${id}`);
      const newList = await api.get(
        `/commemoratives?page=${pageActive}&qtdPage=${perPage}&search=${query}`,
      );
      setData(newList.data.commemoratives);
      if (response.data.message === 'Commemorative deleted successfully.') {
        toast.success('Commemorative date successfully deleted.');
      }
    } catch (error) {
      toast.error('It was not possible to exclude Commemorative date.');
    }
  };

  useEffect(() => {
    fetchCommemoratives(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedFn = debounce(async input => {
    setQuery(input);
    setLoadTable(true);
    const response = await api.get(
      `/commemoratives?page=1&qtdPage=${perPage}&search=${input}`,
    );
    setData(response.data.commemoratives);
    setTotalRows(response.data.total);
    setLoadTable(false);
  }, 500);

  const onChange = event => {
    const input = event.target.value.toLowerCase();
    debouncedFn(input);
  };

  const toggle = () => {
    setShowModal(!showModal);
  };

  const handleSubmit = async ({ name, description }) => {
    try {
      const data = new FormData();

      const files = images.map(image => {
        return image.file;
      });

      for (let i = 0; i < files.length; i += 1) {
        data.append('images', files[i]);
      }
      data.append('name', name);
      data.append('description', description);
      const config = {
        headers: { 'content-type': 'multipart/form-data' },
      };

      const response = await api.post('/commemoratives', data, config);
      const newList = await api.get(
        `/commemoratives?page=${pageActive}&qtdPage=${perPage}&search=${query}`,
      );
      setData(newList.data.commemoratives);
      toast.success('Commemorative Date successfully created.');
      history.push(`/commemorative-date/${response.data.id}`);
    } catch (error) {
      toast.error('It was not possible to create a commemorative date.');
    }
  };

  const columns = [
    {
      name: 'ID',
      selector: 'id',
      sortable: false,
    },
    {
      name: 'Name',
      selector: 'name',
      sortable: false,
    },
    {
      name: 'Description',
      selector: 'description',
      sortable: false,
      cell: row => <div>{row.description}</div>,
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
          <Button
            color="success"
            onClick={() => {
              history.push(`/commemorative-date/${row.id}`);
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
      Do you really want to delete commemorative date?
      <br />
      <b>Note:</b> once deleted it will not be possible to revert the deletion.
    </div>
  );

  const onChangeImageList = imageList => {
    const imagesListFinaly = imageList.filter(
      image => !image.url.includes('http'),
    );
    setImages(imagesListFinaly);
  };

  return (
    <div className="animated fadeIn">
      <div className="register">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>Register commemorative date.</strong>
              </CardHeader>
              <CardBody>
                <Form schema={schema} onSubmit={handleSubmit}>
                  <div className="input-form">
                    <Input
                      label="Name"
                      name="name"
                      type="text"
                      placeholder="Name"
                      required
                    />
                  </div>
                  <div className="input-form">
                    <Input
                      label="Description"
                      name="description"
                      type="text"
                      multiline
                      placeholder="Description"
                      required
                    />
                  </div>
                  <Row className="complement-info">
                    <Col xs="12" md="12">
                      <ImageUploading
                        multiple
                        onChange={onChangeImageList}
                        maxNumber={maxNumber}
                        defaultValue={images}
                      />
                    </Col>
                  </Row>
                  <div className="button-submit">
                    <Button color="primary">Register commemorative date</Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      <Table
        title="Comemorative dates"
        placeholderInput="Search by name"
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
          deleteCommemorative(idToDelete);
        }}
        cancelButton={() => {
          toggle('delete');
        }}
        title="Delete commemorative date"
        content={contentModaldelete}
        firstBtnTitle="Delete"
        secondBtnTitle="Cancel"
      />
    </div>
  );
};

export default Commemoratives;
