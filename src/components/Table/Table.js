import React from 'react';
import DataTable from 'react-data-table-component';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import propTypes from 'prop-types';

import * as S from './styles';

const Table = ({
  title,
  placeholderInput,
  onChange,
  columns,
  data,
  loading,
  totalRows,
  handlePerRowsChange,
  handlePageChange,
}) => {
  return (
    <div className="animated fadeIn">
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify" /> {title}
            </CardHeader>
            <CardBody>
              <DataTable
                subHeader
                subHeaderComponent={
                  <div>
                    <S.Input
                      name="search"
                      type="text"
                      placeholder={placeholderInput}
                      required
                      onChange={onChange}
                    />
                  </div>
                }
                columns={columns}
                data={data}
                highlightOnHover
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

Table.propTypes = {
  title: propTypes.string.isRequired,
  placeholderInput: propTypes.string,
  onChange: propTypes.func.isRequired,
  columns: propTypes.arrayOf(propTypes.shape()).isRequired,
  data: propTypes.arrayOf(propTypes.shape()).isRequired,
  loading: propTypes.bool.isRequired,
  totalRows: propTypes.number.isRequired,
  handlePerRowsChange: propTypes.func.isRequired,
  handlePageChange: propTypes.func.isRequired,
};

Table.defaultProps = {
  placeholderInput: 'Search by email',
};

export default Table;
