import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input } from '@rocketseat/unform';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import history from '../../services/history';
import api from '../../services/api';
import { ImageUploading } from '../../components';

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
});

const maxNumber = 1;
const Commemorative = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [deleteIds, setDeleteIds] = useState([]);

  const fetchCommemorative = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/commemoratives/${id}`);
      setName(response.data.commemorative.name);
      setImages(response.data.commemorative.image);
      setDescription(response.data.commemorative.description);
    } catch (error) {
      toast.error(
        'It was not possible to access information on the anniversary card.',
      );
      history.push('/commemorative-date');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommemorative();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      data.append('excluded_images', deleteIds.toString());

      await api.put(`/commemoratives/${id}`, data);
      toast.success('Successful date updated.');
      history.push('/commemorative-date');
    } catch (error) {
      toast.error('It was not possible to update a date.');
    }
  };

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
                <strong>Update de data comemorativa</strong>
              </CardHeader>
              <CardBody>
                {loading ? (
                  <div
                    style={{
                      height: '80px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <b>Loading...</b>
                  </div>
                ) : (
                  <>
                    <Form
                      schema={schema}
                      onSubmit={handleSubmit}
                      initialData={{ name, description }}
                    >
                      <div className="input-form">
                        <Input
                          label="Nome"
                          name="name"
                          type="text"
                          placeholder="Name of commemorative date"
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
                            deletedIds={setDeleteIds}
                          />
                        </Col>
                      </Row>
                      <div className="button-submit">
                        <Button color="primary">
                          Update commemorative date
                        </Button>
                      </div>
                    </Form>
                    <div className="button-submit">
                      <Button
                        color="success"
                        onClick={() => {
                          history.push('/commemorative-date');
                        }}
                      >
                        Back
                      </Button>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Commemorative;
