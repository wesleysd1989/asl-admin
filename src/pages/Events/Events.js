import React, { useState, useEffect } from 'react';
import { Form, Input, Select } from '@rocketseat/unform';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import * as Yup from 'yup';
import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import XLSX from 'xlsx';

import history from '../../services/history';
import api from '../../services/api';
import { Table, Modal } from '../../components';

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  commemorative_id: Yup.string().required('depois escrevo'),
  employees: Yup.array().required('escrevo depois'),
});

const Events = () => {
  const [data, setData] = useState([]);
  const [loadTable, setLoadTable] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [query, setQuery] = useState('');
  const [commemorativeList, setCommemorativeList] = useState([]);
  const [pageActive, setPageActive] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(0);
  const SheetJSFT = [
    'xlsx',
    'xlsb',
    'xlsm',
    'xls',
    'xml',
    'csv',
    'txt',
    'ods',
    'fods',
    'uos',
    'sylk',
    'dif',
    'dbf',
    'prn',
    'qpw',
    '123',
    'wb*',
    'wq*',
    'html',
    'htm',
  ]
    .map(function(x) {
      return '.' + x;
    })
    .join(',');

  const fetchEvents = async page => {
    setLoadTable(true);
    setPageActive(page);
    const response = await api.get(
      `/events?page=${page}&qtdPage=${perPage}&search=${query}`,
    );
    const res = await api.get(`/commemoratives`);
    const selectCommemoratives = res.data.commemoratives.map(commemorative => {
      return { id: commemorative.id, title: commemorative.name };
    });
    setCommemorativeList(selectCommemoratives);
    setData(response.data.events);
    setTotalRows(response.data.total);
    setLoadTable(false);
  };

  const handlePageChange = page => {
    fetchEvents(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoadTable(true);
    setPageActive(page);
    const response = await api.get(
      `/events?page=${page}&qtdPage=${newPerPage}&search=${query}`,
    );
    setData(response.data.events);
    setPerPage(newPerPage);
    setLoadTable(false);
  };

  const deleteEvent = async id => {
    try {
      const response = await api.delete(`/events/${id}`);
      const newList = await api.get(
        `/events?page=${pageActive}&qtdPage=${perPage}&search=${query}`,
      );
      setData(newList.data.events);
      if (response.data.message === 'Commemorative deleted successfully.') {
        toast.success('Event successfully deleted.');
      }
    } catch (error) {
      toast.error('It was not possible to delete event.');
    }
  };

  useEffect(() => {
    fetchEvents(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedFn = debounce(async input => {
    setQuery(input);
    setLoadTable(true);
    const response = await api.get(
      `/events?page=1&qtdPage=${perPage}&search=${input}`,
    );
    setData(response.data.events);
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

  const handleSubmit = async data => {
    try {
      const imageCommemorative = await api.get(
        `/commemoratives/${parseFloat(data.commemorative_id)}`,
      );
      const body = {
        name: data.name,
        commemorative_id: parseFloat(data.product_id),
        image_id: imageCommemorative?.data?.commemorative?.image[0]?.id || 1,
      };
      const response = await api.post('/events', body);
      const newList = await api.get(
        `/events?page=${pageActive}&qtdPage=${perPage}&search=${query}`,
      );
      setData(newList.data.events);
      history.push(`/events/${response.data.id}`);
      toast.success('Event successfully created.');
    } catch (error) {
      toast.error('It was not possible to create an event.');
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
          <Button
            color="success"
            onClick={() => {
              history.push(`/events/${row.id}`);
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
      Do you really want to delete an event?
      <br />
      <b>Note:</b> once deleted it will not be possible to reverse the deletion.
    </div>
  );

  const convertToJson = (csv) => {
    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    //return result; //JavaScript object
    return JSON.stringify(result, null, 2); //JSON
  }

  const handleFile = event => {
    const file = event.target.files[0];
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = e => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        type: rABS ? 'binary' : 'array',
        bookVBA: true,
      });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      //const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      const data = XLSX.utils.sheet_to_json(ws);
      /* Update state */
      console.log(JSON.stringify(data, null, 2))
      // console.log(convertToJson(data));
      // setDataFile(data);
      //setCols(make_cols(ws['!ref']));
    };

    if (rABS) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleChange = event => {
    const files = event.target.files;
    if (files && files[0]) {
      handleFile(event)
    };
  };

  return (
    <div className="animated fadeIn">
      <div className="register">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>Register event</strong>
              </CardHeader>
              <CardBody>
                {!loadTable ? (
                  <Form schema={schema} onSubmit={handleSubmit}>
                    <div className="input-form">
                      <Input
                        label="Name"
                        name="name"
                        type="text"
                        placeholder="Name of event"
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
                            required
                          />
                        </div>
                      </Col>
                      <input
                        type="file"
                        className="form-control"
                        id="file"
                        accept={SheetJSFT}
                        onChange={handleChange}
                      />
                    </Row>
                    <div className="button-submit">
                      <Button color="primary">Register event</Button>
                    </div>
                  </Form>
                ) : (
                  <div>
                    <b>Loading...</b>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      <Table
        title="Events"
        onChange={onChange}
        columns={columns}
        data={data}
        loading={loadTable}
        totalRows={totalRows}
        handlePerRowsChange={handlePerRowsChange}
        handlePageChange={handlePageChange}
        placeholderInput="Search by name"
      />
      <Modal
        showModal={showModal}
        confirmButton={() => {
          toggle('delete');
          deleteEvent(idToDelete);
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

export default Events;
