import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Form, Button } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import "./Signup.css";
import { BsPersonPlusFill } from "react-icons/bs";
import { url } from "../url";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [userinfo, setuserinfo] = useState(undefined);
  const [asAdmin, setasAdmin] = useState(false);
  let navigate = useNavigate();
  useEffect(() => {
    let user = localStorage.getItem("user");
    let admin = localStorage.getItem("admin");
    if (user) {
      navigate("/userInterface");
    }
    if (user) {
      navigate("/admin");
    }
  }, []);

  //as admin checkbox handling
  const asAdminFn = (e) => {
    setasAdmin(!asAdmin);
    if (e.target.checked) {
      setuserinfo({ ...userinfo, role: e.target.value });
    }
  };
  //
  async function handleSubmit(event) {
    try {
      event.preventDefault();
      const { data } = await axios.post(`${url}/user/signup`, userinfo);

      if (data.success) {
        toast.success("Signup successfully!");
        if (data.userDetails.role === "user") {
          localStorage.setItem("user", data.userDetails.email);
          localStorage.setItem("id", data.userDetails._id);
          localStorage.setItem("name", data.userDetails.name);
          navigate("/");
        } else if (data.userDetails.role === "admin") {
          localStorage.setItem("admin", data.userDetails.email);
          navigate("/admin");
        }
      }
      if (data.userExists) {
        toast.error("User already Exists! Create a new User");
      }
    } catch (error) {
      console.log("ERR in SignUp", error);
    }
  }

  return (
    <div className="main">
      <Toaster />
      <div className="SignupMain">
        <h3 style={{ textAlign: "center", marginTop: "-30px" }}>
          Create a new Account
        </h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group size="lg" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              autoFocus
              type="text"
              onChange={(e) =>
                setuserinfo({ ...userinfo, name: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group size="lg" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              onChange={(e) =>
                setuserinfo({ ...userinfo, email: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group size="lg" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) =>
                setuserinfo({ ...userinfo, password: e.target.value })
              }
              required
            />
            <p>Note: If you don't select admin then will be user</p>
          </Form.Group>
          <Form.Check
            checked={asAdmin}
            style={{ marginLeft: "2px" }}
            type="checkbox"
            id={`admin`}
            label={"Admin"}
            value={"admin"}
            onChange={(e) => asAdminFn(e)}
          ></Form.Check>
          <Button
            className="SignupButton"
            variant="success"
            block="true"
            size="lg"
            type="submit"
          >
            <BsPersonPlusFill
              style={{
                fontSize: "20px",
                marginLeft: "-10px",
                marginRight: "7px",
              }}
            />
            Sign Up
          </Button>
          <p style={{ marginTop: "15px" }}>
            Already Have an account. <a href="/login">Login</a>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
