import React, { useRef, useState, useEffect } from 'react';
import { FileDrop } from 'react-file-drop';
import PropTypes from 'prop-types';

import { getBase64 } from './utils';
import * as S from './styles';

const defaultErrors = {
  maxNumber: false,
  acceptType: false,
};

const ImageUploading = ({
  multiple,
  onChange,
  maxNumber,
  defaultValue,
  acceptType,
  deletedIds,
}) => {
  const inputRef = useRef(null);
  const [keyUpdate, setKeyUpdate] = useState('');
  const [idsDeleted, setIdsDeleted] = useState([]);
  const [errors, setErrors] = useState({ ...defaultErrors });
  const [imageList, setImageList] = useState(() => {
    let initImageList = [];
    if (defaultValue) {
      initImageList = defaultValue.map(item => ({
        ...item,
        key: item.url,
        onRemove: () => onImageRemove(item.url),
      }));
    }
    return initImageList;
  });

  const onStandardizeDataChange = list => {
    if (onChange) {
      const sData = list.map(({ key, onRemove, ...restOfItem }) => ({
        ...restOfItem,
      }));
      onChange(sData);
    }
  };

  const onImageUpload = () => {
    // eslint-disable-next-line no-unused-expressions
    inputRef.current && inputRef.current.click();
  };

  const onImageRemove = key => {
    setImageList(previousList => {
      const updatedList = previousList.filter(item => {
        if (item.key !== key) {
          return true;
        }
        if (item.id) {
          setIdsDeleted(oldArray => [...oldArray, item.id]);
        }
        return false;
      });
      onStandardizeDataChange(updatedList);
      return updatedList;
    });
  };

  useEffect(() => {
    if (keyUpdate) {
      onImageUpload();
    }
  }, [keyUpdate]);

  useEffect(() => {
    deletedIds(idsDeleted);
  }, [deletedIds, idsDeleted]);

  const getListFile = files => {
    const promiseFiles = [];

    for (let i = 0; i < files.length; i++) {
      promiseFiles.push(getBase64(files[i]));
    }

    return Promise.all(promiseFiles).then(fileListBase64 => {
      const fileList = fileListBase64.map((base64, index) => {
        const key = `${new Date().getTime().toString()}-${files[index].name}`;
        return {
          url: base64,
          file: files[index],
          key,
          onRemove: () => onImageRemove(key),
        };
      });
      return fileList;
    });
  };

  const onDragAndDrop = async file => {
    const newFile = await getListFile(file);
    const total = newFile.length + imageList.length;
    setErrors({ ...defaultErrors });
    if (total <= 5) {
      setImageList(oldArray => {
        onStandardizeDataChange([...oldArray, ...newFile]);
        return [...oldArray, ...newFile];
      });
    } else {
      setErrors({ ...errors, maxNumber: true });
    }
  };

  const validate = fileList => {
    setErrors({ ...defaultErrors });
    if (maxNumber && fileList.length + imageList.length > maxNumber) {
      setErrors({ ...errors, maxNumber: true });
      return false;
    }
    for (let i = 0; i < fileList.length; i++) {
      const { file } = fileList[i];
      if (file) {
        const fileType = file.type;
        if (!fileType.includes('image')) {
          setErrors({ ...errors, acceptType: true });
          return false;
        }
        if (acceptType && acceptType.length > 0) {
          const type = file.name.split('.').pop() || '';
          if (acceptType.indexOf(type) < 0) {
            setErrors({ ...errors, acceptType: true });
            return false;
          }
        }
      }
    }
    return true;
  };

  const onInputChange = async e => {
    const { files } = e.target;

    if (files) {
      const fileList = await getListFile(files);
      if (fileList.length > 0) {
        if (validate(fileList)) {
          let updatedFileList;
          if (keyUpdate) {
            updatedFileList = imageList.map(item => {
              if (item.key === keyUpdate) return { ...fileList[0] };
              return item;
            });
            setKeyUpdate('');
          } else if (multiple) {
            updatedFileList = [...imageList, ...fileList];
            if (maxNumber && updatedFileList.length > maxNumber) {
              updatedFileList = imageList;
            }
          } else {
            updatedFileList = [fileList[0]];
          }
          setImageList(updatedFileList);
          onStandardizeDataChange(updatedFileList);
        }
      } else {
        keyUpdate && setKeyUpdate('');
      }
    }
  };

  const acceptString =
    acceptType && acceptType.length > 0
      ? acceptType.map(item => `.${item}`).join(', ')
      : 'image/*';

  return (
    <>
      <input
        type="file"
        accept={acceptString}
        ref={inputRef}
        multiple={multiple && !keyUpdate}
        onChange={onInputChange}
        style={{ display: 'none' }}
      />
      <S.Container>
        <FileDrop onDrop={files => onDragAndDrop(files)}>
          <S.DropContainer style={{}}>
            <S.UploadIcon />
            <p>Drag and drop the image or </p>
            <div role="button" tabIndex={0} onClick={onImageUpload}>
              &nbsp;search&nbsp;
            </div>
            <p> on your computer</p>
          </S.DropContainer>
        </FileDrop>
        {errors.maxNumber && (
          <S.ErrorMaxNumber>
            {`The number of images cannot be greater than ${maxNumber}.`}
          </S.ErrorMaxNumber>
        )}
        <S.ImageList>
          {imageList.map(image => (
            <S.ImageView key={image.key}>
              <S.RemoveImage
                role="button"
                tabIndex={0}
                onClick={image.onRemove}
              >
                <S.IconClose />
              </S.RemoveImage>
              <img src={image.url} alt={image.url} width="76" height="74" />
            </S.ImageView>
          ))}
        </S.ImageList>
      </S.Container>
    </>
  );
};

ImageUploading.propTypes = {
  maxNumber: PropTypes.number,
  multiple: PropTypes.bool,
  acceptType: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.any,
  deletedIds: PropTypes.func.isRequired,
};

ImageUploading.defaultProps = {
  maxNumber: 1000,
  multiple: false,
  acceptType: [],
  defaultValue: null,
  deletedIds: () => {},
};

export default ImageUploading;
