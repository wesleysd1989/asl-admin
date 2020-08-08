import React from 'react';
import { useSelector } from 'react-redux';
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/asl-logo.png';
import sygnet from '../../assets/img/brand/asl-logo-sygnet.png';

const DefaultHeader = props => {
  const profile = useSelector(state => state.user.profile);
  const { handleSignOut } = props;
  return (
    <>
      <AppSidebarToggler className="d-lg-none" display="md" mobile />
      <AppNavbarBrand
        full={{ src: logo, width: 89, height: 25, alt: 'CoreUI Logo' }}
        minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}
      />
      <AppSidebarToggler className="d-md-down-none" display="lg" />
      <Nav className="ml-auto mr-3" navbar>
        <UncontrolledDropdown nav direction="down">
          <DropdownToggle nav>
            <img
              src={
                profile.avatar?.url ||
                'https://api.adorable.io/avatars/50/abott@adorable.png'
              }
              className="img-avatar"
              alt={profile.avatar?.path}
            />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem header tag="div" className="text-center">
              <strong>Settings</strong>
            </DropdownItem>
            <Link to="/profile" style={{ textDecoration: 'none' }}>
              <DropdownItem>
                <i className="fa fa-user" /> Profile
              </DropdownItem>
            </Link>
            <DropdownItem>
              <i className="fa fa-wrench" /> Settings
            </DropdownItem>
            <DropdownItem onClick={e => handleSignOut(e)}>
              <i className="fa fa-lock" /> Logout
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </>
  );
};

DefaultHeader.propTypes = {
  handleSignOut: propTypes.func,
};
DefaultHeader.defaultProps = {
  handleSignOut: () => {},
};

export default DefaultHeader;
