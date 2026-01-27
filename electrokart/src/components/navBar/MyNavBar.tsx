import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const MyNavbar: React.FC = () => {
  const navigate = useNavigate();
  const cartCount = useSelector((state: any) => state.cart.items.length);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const user_id = sessionStorage.getItem('user_id')
  const id = `/orderDetails/${user_id}`
  return (
    <Navbar style={{ backgroundColor: "dodgerblue" }} variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/gridwall">ElectroKart</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/gridwall">Products</Nav.Link>
            <Nav.Link as={Link} to={id} >Orders</Nav.Link>
            <Nav.Link as={Link} to="/cart" className="position-relative">
              Cart
              {cartCount > 0 && (
                <span className="badge rounded-pill bg-danger ms-1">{cartCount}</span>
              )}
            </Nav.Link>
            <Button variant="outline-light" className="ms-3 btn-sm" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar