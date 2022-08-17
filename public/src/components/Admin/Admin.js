import React, { useEffect, useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { FaCat, FaHome, FaBook, FaUsers } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Button, Form, Modal, Table, Spinner } from "react-bootstrap";
import "./Admin.css";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { GiClick } from "react-icons/gi";
import FileBase64 from "react-file-base64";
import axios from "axios";
import { url } from "../url";
import toast, { Toaster } from "react-hot-toast";
import { FcDeleteColumn } from "react-icons/fc";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { GrUserAdmin } from "react-icons/gr";

const Admin = () => {
  const [showBooks, setshowBooks] = useState(true);
  const [modalShow, setModalShow] = React.useState(false);
  const [modalShow2, setModalShow2] = React.useState(false);
  const [booksValues, setbooksValues] = React.useState(false);
  const [printBooks, setprintBooks] = React.useState(false);
  const [pageRefresh, setpageRefresh] = React.useState(false);
  const [showUsers, setshowUsers] = React.useState(false);
  const [loading, setloading] = React.useState(false);
  const [UserList, setUserList] = React.useState(false);
  const [rentalDetails, setrentalDetails] = React.useState(false);
  const [userForEmail, setuserForEmail] = React.useState(false);

  useEffect(() => {
    getBooks();
    getUser();
  }, [pageRefresh]);
  // logout
  let user = localStorage.getItem("user");
  let admin = localStorage.getItem("admin");
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
  let navigate = useNavigate();
  useEffect(() => {
    let admin = localStorage.getItem("admin");
    if (!admin) {
      navigate("/login");
    }
  }, []);
  //set mutiple states at once also we can do that
  const submitBooks = async () => {
    try {
      const { data } = await axios.post(`${url}/admin/addbooks`, booksValues);
      if (data.success) {
        toast.success(data.message);
        setpageRefresh(!pageRefresh);
        setModalShow(false);
      } else if (data.success === false) {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //set mutiple states at once also we can do that
  const getBooks = async () => {
    try {
      setloading(true);
      const { data } = await axios.get(`${url}/admin/getbooks`);
      if (data.success) {
        setprintBooks(data.data);
        setloading(false);
      } else if (data.success === false) {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };
  // delete A Book
  const deleteABook = async (id) => {
    try {
      const { data } = await axios.delete(`${url}/admin/deleteBook/${id}`);
      toast.success(data.message);
      setpageRefresh(!pageRefresh);
    } catch (error) {
      console.log(error);
    }
  };
  // delete A Book
  const deleteAUser = async (id) => {
    try {
      const { data } = await axios.delete(`${url}/user/deleteUser/${id}`);
      toast.success(data.message);
      setpageRefresh(!pageRefresh);
    } catch (error) {
      console.log(error);
    }
  };
  // show users
  const showUsersListfn = async () => {
    setshowBooks(false);
    setshowUsers(true);
    await getUser();
  };
  // show only books
  const showBooksOnly = () => {
    setshowBooks(true);
    setshowUsers(false);
  };
  // const getUser
  const getUser = async () => {
    try {
      const { data } = await axios.get(`${url}/user/getusers`);
      if (data.success) {
        setUserList(data.data);
      } else if (data.success === false) {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };
  // shewRentalDetails
  const shewRentalDetails = async (leaseTime, books, username, email) => {
    try {
      const { data } = await axios.post(`${url}/user/getRentalDetails`, books);
      setuserForEmail({ username, email });
      if (data.success) {
        let books = data.data;
        let allDetails = [...books, ...leaseTime];
        setrentalDetails(allDetails);
        setModalShow2(true);
      } else if (data.success === false) {
        toast.error(data.message);
      }
    } catch (error) {}
  };
  // sendEmail
  const sendEmail = () => {
    var templateParams = {
      from_name: "abdc.johncarter@gmail.com",
      message: `Hi dear ${userForEmail.username} your books leasing time has been expired`,
      reciver_email: userForEmail.email,
    };
    emailjs
      .send(
        "service_4tdmfe2",
        "template_zoo96jp",
        templateParams,
        "UgbKqc5ZMivuhLwm9"
      )
      .then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
          toast.success("Email sent successfully");
        },
        function (err) {
          console.log("FAILED...", err);
          toast.error("Failed to send email");
        }
      );
    toast.success("Email sent succesfully. Thanks!");
    setModalShow2(false);
    setTimeout(() => {
      toast.success("Thanks for using our service!");
    }, 2000);
  };

  // ends
  return (
    <div className="mainTab">
      <Toaster />
      {/* tabs react */}
      <div
        className="mainForTabs"
        style={{
          background: "rgb(78, 76, 76)",
          float: "left",
          paddingRight: "15px",
          minHeight: "500px",
        }}
      >
        <div>
          <h2 className="item1">
            <FaHome /> Dashboard
          </h2>
          <p style={{ color: "red", textAlign: "center" }}>Admin only *</p>
          <hr style={{ color: "white" }} />
          <p
            className={showBooks ? "item2Active" : "item2"}
            onClick={() => showBooksOnly()}
          >
            <FaBook /> Books
            {loading ? (
              <>
                <Spinner style={{ color: "white" }} animation="border" />
              </>
            ) : null}
          </p>
          <p
            className={showUsers ? "item2Active" : "item2"}
            onClick={() => showUsersListfn()}
          >
            <FaUsers /> Users List
          </p>
          <p className="item3" onClick={() => logout()}>
            <RiLogoutCircleRLine /> Logout
          </p>
        </div>
      </div>
      {/* show the tabs content on state conditions react */}
      {/*Show Books table in sidebar */}
      {showBooks ? (
        <div
          style={{
            background: "white",
            height: "100vh",
            opacity: "0.9",
            float: "left",
            width: "82vw",
          }}
        >
          {" "}
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <div>
              <Button
                variant="success"
                size="sm"
                style={{ marginLeft: "-200px", marginTop: "4px" }}
                onClick={() => setModalShow(true)}
              >
                <IoMdAdd /> Add New Book
              </Button>
            </div>
            <h3 style={{ textAlign: "center", marginLeft: "-280px" }}>
              All Books List
            </h3>
          </div>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Book Name</th>
                <th>Author Name</th>
                <th>Category</th>
                <th>Publication</th>
                <th>Book Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {printBooks &&
                printBooks.map((val, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{val.title}</td>
                    <td>{val.author}</td>
                    <td>{val.category}</td>
                    <td>{val.publication}</td>
                    <td>
                      <img
                        src={val.image}
                        width="50px"
                        height={"50px"}
                        style={{ borderRadius: "30px" }}
                      />
                    </td>
                    <td>
                      <Button
                        onClick={() => {
                          deleteABook(val._id);
                        }}
                      >
                        {" "}
                        <FcDeleteColumn /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      ) : null}
      {/* modal */}
      {/* show users lists */}
      {showUsers ? (
        <div
          style={{
            background: "white",
            height: "100vh",
            opacity: "0.9",
            float: "left",
            width: "82vw",
          }}
        >
          {" "}
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <h3 style={{ textAlign: "center", marginLeft: "-280px" }}>
              All Users List
            </h3>
          </div>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Books Owned</th>
                <th>User Profile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {UserList &&
                UserList.map(
                  (val, index) =>
                    val.role !== "admin" && (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{val.name}</td>
                        <td>{val.email}</td>
                        <td>
                          <Button
                            onClick={() =>
                              shewRentalDetails(
                                val.leaseTime,
                                val.books,
                                val.name,
                                val.email
                              )
                            }
                          >
                            Show Rental Details
                          </Button>
                        </td>

                        <td>
                          <img
                            src={val.image}
                            width="50px"
                            height={"50px"}
                            style={{ borderRadius: "30px" }}
                          />
                        </td>
                        <td>
                          <Button
                            onClick={() => {
                              deleteAUser(val._id);
                            }}
                          >
                            {" "}
                            <FcDeleteColumn /> Delete
                          </Button>
                        </td>
                      </tr>
                    )
                )}
            </tbody>
          </Table>
        </div>
      ) : null}
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
            <IoMdAddCircleOutline /> Add a New Book
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Book Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter A Book Name"
                required
                onChange={(e) =>
                  setbooksValues({ ...booksValues, title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Author Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Write Name"
                required
                onChange={(e) =>
                  setbooksValues({ ...booksValues, author: e.target.value })
                }
              />
            </Form.Group>

            <Form.Select
              aria-label="Default select example"
              onChange={(e) =>
                setbooksValues({ ...booksValues, category: e.target.value })
              }
            >
              <option>Select a Category</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Mystery">Mystery</option>
              <option value="Thriller">Thriller</option>
              <option value="Romance">Romance</option>
            </Form.Select>
            <p></p>
            <Form.Select
              aria-label="Default select example"
              onChange={(e) =>
                setbooksValues({ ...booksValues, publication: e.target.value })
              }
            >
              <option>Select A Publication Type</option>
              <option value="Encyclopedias">Encyclopedias</option>
              <option value="General Knowledge">General Knowledge</option>
              <option value="Handbooks">Handbooks</option>
              <option value="Research reports">Research reports</option>
              <option value="Scholarly Journals">Scholarly Journals</option>
            </Form.Select>
            <p></p>
            {/* upload book image */}

            <img
              width={"100px"}
              height={"100px"}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5DHRopW9YCFwkwbDV4jRPzpkF7bl3KhuR191I6rqN86qQ7ZICR-qxj0s_cGBQmdRYwoI&usqp=CAU"
            />

            <FileBase64
              multiple={false}
              onDone={(file) =>
                setbooksValues({ ...booksValues, image: file.base64 })
              }
            />

            <p style={{ color: "green" }}>* All details to fill is mandatory</p>
            <Button variant="primary" onClick={() => submitBooks()}>
              <GiClick /> Add Book
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setModalShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {/* see the rental details */}{" "}
      <Modal
        show={modalShow2}
        onHide={() => setModalShow2(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <IoMdAddCircleOutline /> Rental Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {rentalDetails &&
            rentalDetails.map((val) => (
              <>
                <h4>Books</h4>
                Name: {val.title}
                <h4>Publication</h4>
                {val.publication}
                <h3>Lease Time</h3>
                <h4>Start Time</h4>
                {val.startTime}
                <h4>End Time</h4>
                {val.endTime}
                <p style={{ color: "red" }}>
                  * See if time is Ended You can send to this user email about
                  leased expired
                </p>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => sendEmail(val.name, val.title)}
                >
                  <FiSend /> Send Email For This Book Expiration
                </Button>
                <hr />
              </>
            ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setModalShow2(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Admin;
// service_4tdmfe2
