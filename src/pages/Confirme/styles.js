import styled from 'styled-components';

export const Container = styled.div`
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 315px;
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 4px;
  padding: 30px 10px;
  span {
    align-self: flex-start;
  }
  button {
    margin-top: 30px;
  }
`;
