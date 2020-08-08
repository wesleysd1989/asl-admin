import styled from 'styled-components';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloseIcon from '@material-ui/icons/Close';

export const Container = styled.div``;

export const DropContainer = styled.div`
  min-width: 100%;
  min-height: 80px;
  background: #fefefe;
  box-sizing: border-box;
  border: 1px dashed #cccccc;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    font-weight: 600;
    font-size: 12px;
    line-height: 14px;
    color: #888888;
    margin-top: 0;
    margin-bottom: 0;
  }
  svg {
    margin-right: 8px;
  }
  div {
    font-weight: 600;
    font-size: 12px;
    line-height: 14px;
    color: #20a8d8;
    cursor: pointer;
    text-decoration: underline #20a8d8;
  }
`;

export const UploadIcon = styled(CloudUploadIcon)`
  color: #888888;
`;

export const RemoveImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #20a8d8;
  top: -8px;
  right: -8px;
  z-index: 2;
  position: absolute;
`;

export const IconClose = styled(CloseIcon)`
  color: #fff;
  width: 14px;
  height: 14px;
`;

export const ImageView = styled.div`
  max-width: 76.8px;
  max-height: 74px;
  min-width: 76.8px;
  min-height: 74px;
  border-radius: 4px;
  position: relative;
  display: flex;
  margin-top: 16px;
  margin-right: 8px;
  img {
    border-radius: 4px;
    width: 100%;
    object-fit: cover;
  }
`;

export const ImageList = styled.div`
  display: flex;
`;

export const ErrorMaxNumber = styled.span`
  color: red;
`;
