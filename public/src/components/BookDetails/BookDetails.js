import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { url } from "../url";
import { VscDebugStart } from "react-icons/vsc";
import { Rating } from "react-simple-star-rating";
import { RiHome4Fill, RiSendPlaneLine } from "react-icons/ri";

const BookDetails = () => {
  const navigate = useNavigate();
  const [state, setstate] = useState();
  const [rating, setRating] = useState(0);
  const [comment, setcomment] = useState();
  const [Showcomment, setShowcomment] = useState();
  const { id } = useParams();
  useEffect(() => {
    singleBook();
    getComments();
  }, []);

  useEffect(() => {
    let user = localStorage.getItem("user");
    let admin = localStorage.getItem("admin");
    if (!user && !admin) {
      navigate("/login");
    }
  }, []);
  const username = localStorage.getItem("name");
  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate);
  };
  //   get single book data
  const singleBook = async () => {
    try {
      const { data } = await axios.get(`${url}/user/singleBook/${id}`);
      console.log(data.data);
      if (data.success) {
        setstate(data.data);
      } else if (data.success === false) {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  //   rateNow
  const rateNow = async (bookId) => {
    try {
      const { data } = await axios.post(
        `${url}/user/rateNow/${bookId}/${rating}`
      );

      if (data.success) {
        setstate(data.data);
        toast.success(data.message);
      } else if (data.success === false) {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  //   post a comment
  const postComment = async (event) => {
    try {
      event.preventDefault();
      if (!comment) {
        toast.error("Don't field empty!");
        return;
      }
      const { data } = await axios.post(
        `${url}/user/postComment/${id}`,
        comment
      );
      if (data.success) {
        setstate(data.data);
        toast.success(data.message);
      } else if (data.success === false) {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  // get comments
  const getComments = async () => {
    try {
      const { data } = await axios.get(`${url}/user/getcomments/${id}`);
      console.log(data);
      if (data.success) {
        setShowcomment(data.data);
      } else if (data.success === false) {
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while getting comments");
    }
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      <Toaster />
      <div>
        <Card
          style={{
            width: "30rem",
            marginTop: "10px",
            marginBottom: "30px",
            cursor: "pointer",
          }}
        >
          <Card.Img
            style={{ width: "100%", height: "200px" }}
            variant="top"
            src={state?.image}
          />
          <Card.Body>
            <Card.Title>Name: {state?.name}</Card.Title>
            <Card.Text style={{ fontWeight: "bold" }}>
              Author: {state?.author}
            </Card.Text>
            <Card.Text style={{ fontWeight: "bold" }}>
              Category: {state?.category}
            </Card.Text>
            <Card.Text>Publication: {state?.publication}</Card.Text>
            <Rating
              onClick={handleRating}
              ratingValue={rating} /* Available Props */
            />
            <Card.Text>Rate this book now!</Card.Text>
            <Button variant="secondary" onClick={() => rateNow(state?._id)}>
              <VscDebugStart /> Rate now!
            </Button>
          </Card.Body>
        </Card>
      </div>
      {/* comment section */}
      <div>
        <h5 style={{ color: "white" }}>Submit your comments</h5>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label style={{ color: "white" }}>Write a comment</Form.Label>
            <Form.Control
              type="text"
              placeholder="Write a comment"
              onChange={(e) =>
                setcomment({ username, comment: e.target.value })
              }
              required
            />
            <Form.Text style={{ color: "white" }}>
              Share your thoughts about the book.
            </Form.Text>
          </Form.Group>
          <Button
            type="submit"
            onClick={(e) => postComment(e)}
            variant="primary"
          >
            Post comment <RiSendPlaneLine />{" "}
          </Button>
        </Form>
        <p></p>
        <div>
          <h2 style={{ color: "white" }}>Your comments</h2>
          <div>
            {state &&
              state.comments.map((val, index) => (
                <div
                  style={{ background: "white", padding: "5px" }}
                  key={index}
                >
                  <h3>{val.username}:</h3>
                  <p>{val.comment}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
