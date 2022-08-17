import React, { useEffect, useState } from "react";
import { Button, Card, Dropdown, Form, Modal, Spinner } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { FaCartPlus, FaFilter } from "react-icons/fa";
import { FcRight } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../url";

const Home = () => {
  const [rating, setRating] = useState(0); // initial rating value
  const [modalShow, setModalShow] = React.useState(false);
  const [booksValues, setbooksValues] = React.useState(false);
  const [printBooks, setprintBooks] = React.useState(false);
  const [ValuesForBuyBooks, setValuesForBuyBooks] = React.useState();
  const [loading, setloading] = React.useState(false);
  const [ifSearchOn, setifSearchOn] = React.useState(false);
  const [searchResults, setsearchResults] = React.useState(false);
  let navigate = useNavigate();
  useEffect(() => {
    getBooks();
    let user = localStorage.getItem("user");
    let admin = localStorage.getItem("admin");
    if (!user && !admin) {
      navigate("/login");
    }
  }, []);
  // get all books to show at home
  const getBooks = async () => {
    try {
      setloading(true);
      const { data } = await axios.get(`${url}/admin/getbooks`);
      if (data.success) {
        setprintBooks(data.data);
        setloading(false);
      } else if (data.success === false) {
        toast.error(data.message);
        setloading(false);
      }
    } catch (e) {
      console.log(e);
      setloading(false);
      toast.error("Internel server error");
    }
  };

  const buyBook = (bookId) => {
    setModalShow(true);
    let userId = localStorage.getItem("id");
    setValuesForBuyBooks({ userId, bookId });
  };
  //confirm Order
  const confirmOrder = async () => {
    try {
      const { data } = await axios.post(
        `${url}/user/buyBook`,
        ValuesForBuyBooks
      );
      if (data.success) {
        toast.success(data.message);
        setModalShow(false);
      } else if (data.success === false) {
        toast.error(data.message);
        setModalShow(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  // add filter
  const filterData = async (filter, type) => {
    setifSearchOn(true);
    try {
      setloading(true);
      const { data } = await axios.get(
        `${url}/user/filterBooks/?filter=${filter}&&type=${type}`
      );
      if (data.success) {
        setsearchResults(data.data);
        setloading(false);
      } else if (data.success === false) {
        toast.error(data.message);
        setloading(false);
      }
    } catch (e) {
      console.log(e);
      setloading(false);
      toast.error("Internel server error");
    }
  };
  return (
    <div>
      <Toaster />
      <div style={{ padding: "20px" }}>
        <h2 style={{ color: "white", textAlign: "center" }}>
          Browse books from the library
        </h2>
        <h5 style={{ color: "white", display: "flex" }}>
          Add Filters <FaFilter /> &nbsp; &nbsp;
          <Form>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Select a category
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => filterData("Fantasy", "category")}
                  >
                    Fantasy
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => filterData("Sci-Fi", "category")}
                  >
                    Sci-Fi
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => filterData("Mystery", "category")}
                  >
                    Mystery
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => filterData("Romance", "category")}
                  >
                    Romance
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              &nbsp; &nbsp; &nbsp;
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Select an author
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {printBooks &&
                    printBooks.map((val) => (
                      <Dropdown.Item
                        onClick={() => filterData(val.author, "author")}
                      >
                        {val.author}
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
              &nbsp; &nbsp; &nbsp;
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Available Publications
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => filterData("Encyclopedias", "publication")}
                  >
                    Encyclopedias
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      filterData("General Knowledge", "publication")
                    }
                  >
                    General Knowledge
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => filterData("Handbooks", "publication")}
                  >
                    Handbooks
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      filterData("Research reports", "publication")
                    }
                  >
                    Research reports
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      filterData("Scholarly Journals", "publication")
                    }
                  >
                    Scholarly Journals
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Form>{" "}
        </h5>
        {printBooks.length === 0 && (
          <h2 style={{ color: "lightgray" }}>No books were added by admin</h2>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
          }}
        >
          {loading && !ifSearchOn ? (
            <>
              <div
                style={{
                  display: "flex",
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                <span style={{ color: "white", fontSize: "30px" }}>
                  Loading...
                </span>
                <Spinner style={{ color: "white" }} animation="border" />
              </div>
            </>
          ) : null}
          {printBooks &&
            !ifSearchOn &&
            printBooks.map((val, index) => (
              <Card
                style={{
                  width: "18rem",
                  marginTop: "10px",
                  marginBottom: "30px",
                  cursor: "pointer",
                }}
              >
                <Card.Img
                  onClick={() => navigate(`bookDetails/${val._id}`)}
                  style={{ width: "100%", height: "200px" }}
                  variant="top"
                  src={val.image}
                />
                <Card.Body>
                  <Card.Title>Name: {val.title}</Card.Title>
                  <Card.Text style={{ fontWeight: "bold" }}>
                    Author: {val.author}
                  </Card.Text>
                  <Card.Text style={{ fontWeight: "bold" }}>
                    Category: {val.category}
                  </Card.Text>
                  <Card.Text>Publication: {val.publication}</Card.Text>
                  <Button variant="success" onClick={() => buyBook(val._id)}>
                    <FaCartPlus /> Buy This Book
                  </Button>
                </Card.Body>
              </Card>
            ))}
          <br />
        </div>

        {/* data for search results */}
        {searchResults.length === 0 && (
          <h2 style={{ color: "lightgray" }}>
            No books were added by admin <a href="/">Back to home</a>
          </h2>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
          }}
        >
          {loading && ifSearchOn ? (
            <>
              <div
                style={{
                  display: "flex",
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                <span style={{ color: "white", fontSize: "30px" }}>
                  Loading...
                </span>
                <Spinner style={{ color: "white" }} animation="border" />
              </div>
            </>
          ) : null}
          {searchResults &&
            ifSearchOn &&
            searchResults.map((val, index) => (
              <Card
                style={{
                  width: "18rem",
                  marginTop: "10px",
                  marginBottom: "30px",
                }}
              >
                <Card.Img
                  onClick={() => navigate(`bookDetails/${val._id}`)}
                  style={{ width: "100%", height: "200px" }}
                  variant="top"
                  src={val.image}
                />
                <Card.Body>
                  <Card.Title>Name: {val.title}</Card.Title>
                  <Card.Text style={{ fontWeight: "bold" }}>
                    Author: {val.author}
                  </Card.Text>
                  <Card.Text style={{ fontWeight: "bold" }}>
                    Category: {val.category}
                  </Card.Text>
                  <Card.Text>Publication: {val.publication}</Card.Text>

                  <Button variant="success" onClick={() => buyBook(val._id)}>
                    <FaCartPlus /> Buy This Book
                  </Button>
                </Card.Body>
              </Card>
            ))}
          <br />
        </div>

        {/* end serach */}

        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Pick a time Request for Lease a this Book
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Please select a start time and end time range to take the book on
              rent.
            </p>
            <p>Start Time:</p>
            <input
              type="date"
              onChange={(e) =>
                setValuesForBuyBooks({
                  ...ValuesForBuyBooks,
                  startTime: e.target.value,
                })
              }
            />
            <p>End Time:</p>
            <input
              type="date"
              onChange={(e) =>
                setValuesForBuyBooks({
                  ...ValuesForBuyBooks,
                  endTime: e.target.value,
                })
              }
            />
            <p />
            <Button onClick={confirmOrder}>
              <FcRight style={{ background: "white" }} /> Confirm Order
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setModalShow(false)}>
              Cancel Order
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Home;
