// Components/Menu.js
import React from "react";
import { Button, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../CSS/menu.css";

const Menu = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      className="mb-4 custom-navbar"
    >
      <Navbar.Brand href="/" className="brand-title">
        Car Rental Service
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto custom-nav">
          <Nav.Link href="/home" className="nav-link-custom">
            Home
          </Nav.Link>
          <Nav.Link href="/dashboard" className="nav-link-custom">
            Dashboard
          </Nav.Link>
        </Nav>
        <Button
          variant="outline-light"
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Menu;
