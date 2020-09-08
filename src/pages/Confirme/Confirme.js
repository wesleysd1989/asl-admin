import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'reactstrap';

import { Container, Content } from './styles';
import api from '../../services/api';
import history from '../../services/history';

const Confirme = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const confirmeAccount = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/confirme/${token}`);
      if (
        response.data.message === 'Account successfully confirmed.' ||
        response.data.message ===
          'Account has already been successfully confirmed.'
      ) {
        setConfirmed(true);
      }
    } catch (error) {
      setConfirmed(false);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    confirmeAccount();
  }, [confirmeAccount]);

  return (
    <Container>
      <Content>
        {confirmed ? (
          <span className="text-center">
            Congratulations account successfully confirmed.{' '}
          </span>
        ) : (
          <span>Error verifying account, please try again later.</span>
        )}
        <Button
          color="primary"
          block
          onClick={() => {
            history.push('/login');
          }}
        >
          {loading ? 'Loading ...' : 'Login'}
        </Button>
      </Content>
    </Container>
  );
};

export default Confirme;
