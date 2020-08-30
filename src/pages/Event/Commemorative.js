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
  name: Yup.string().required('O nome é obrigatório'),
  description: Yup.string().required('description is required'),
});

const maxNumber = 1;
const Commemorative = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [deleteIds, setDeleteIds] = useState([]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/commemoratives/${id}`);
      setName(response.data.commemorative.name);
      setImages(response.data.commemorative.image);
      setDescription(response.data.commemorative.description);
    } catch (error) {
      toast.error(
        'Não foi possível acessar informações do cartao de data comemorativa.',
      );
      history.push('/commemoratives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
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
      toast.success('Data comemorativa atualizada com sucesso.');
      history.push('/commemorative-date');
    } catch (error) {
      toast.error('Não foi possivel atualizar data comemorativa.');
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
                    <b>Carregando</b>
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
                          placeholder="Nome do produto"
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
                        <Button color="primary">Atualizar Produto</Button>
                      </div>
                    </Form>
                    <div className="button-submit">
                      <Button
                        color="success"
                        onClick={() => {
                          history.push('/commemorative-date');
                        }}
                      >
                        Voltar
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
