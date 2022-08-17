import React from "react";
import { Container, Nav, Navbar, Button, Badge, Modal } from "react-bootstrap";
import { IoIosExit } from "react-icons/io";
import { Navigate, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "./Navbar.css";
import axios from "axios";
import { url } from "../url";

const Navbars = () => {
  let navigate = useNavigate();
  let user = localStorage.getItem("user");
  let admin = localStorage.getItem("admin");
  let id = localStorage.getItem("id");
  const [modalShow, setModalShow] = React.useState(false);
  const [loading, setloading] = React.useState(false);
  const [printBooks, setprintBooks] = React.useState(false);

  const logout = () => {
    toast("You are Logged out!");
    if (user) {
      localStorage.removeItem("user");
      localStorage.removeItem("id");
      localStorage.removeItem("name");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
    if (admin) {
      localStorage.removeItem("admin");
      localStorage.removeItem("id");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  };
  // getAllBooks
  const getAllBooks = async () => {
    try {
      setModalShow(true);
      const { data } = await axios.get(`${url}/user/getRentalDetails/${id}`);
      if (data.success) {
        setprintBooks(data.data);
      } else if (data.success === false) {
        toast.error(data.message);
        setModalShow(false);
      }
    } catch (e) {
      console.log(e);
      setloading(false);
      toast.error("Internel server error");
    }
  };
  // navigationToDetails
  const navigationToDetails = (id) => {
    navigate(`/bookDetails/${id}`);
    setModalShow(false);
  };
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Library Management System</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/userInterface">My Profile</Nav.Link>s
            {user && (
              <>
                <Nav.Link onClick={() => getAllBooks()}>Rented Books</Nav.Link>
              </>
            )}
            {user || admin ? (
              <Button
                onClick={() => logout()}
                style={{ marginLeft: "400px" }}
                variant="success"
              >
                <IoIosExit /> Logout &nbsp;{" "}
                <Badge bg="danger">
                  {(user && "User") || (admin && "Admin")}
                </Badge>
              </Button>
            ) : null}
          </Nav>
        </Container>
      </Navbar>

      {/* modal */}
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            You take these books on the rent
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* show books here */}
          <div className="showBooksRented">
            {printBooks &&
              printBooks.map((val, index) => (
                <>
                  <p style={{ fontWeight: "bold" }}>Name: {val.title}</p>
                  <div className="singleBook">
                    <img
                      width={"100px"}
                      height={"100px"}
                      src={val.image}
                      alt=""
                    />
                    <p></p>
                    <p>
                      <Button
                        onClick={() => navigationToDetails(val._id)}
                        size="sm"
                      >
                        Read Book
                      </Button>
                    </p>
                  </div>
                </>
              ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Navbars;
