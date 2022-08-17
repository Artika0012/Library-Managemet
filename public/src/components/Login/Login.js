import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { url } from "../url";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { RiLoginCircleFill } from "react-icons/ri";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userinfo, setuserinfo] = useState(undefined);
  let navigate = useNavigate();
  useEffect(() => {
    let user = localStorage.getItem("user");
    let admin = localStorage.getItem("admin");
    if (user) {
      navigate("/userInterface");
    } else if (admin) {
      navigate("/admin");
    }
  }, []);
  async function handleSubmit(event) {
    try {
      event.preventDefault();
      const { data } = await axios.post(`${url}/user/login`, userinfo);
      console.log(data.role);
      if (data.success) {
        if (data.role === "user") {
          toast.success("Logged In success");
          localStorage.setItem("user", data.userDetails.email);
          localStorage.setItem("id", data.userDetails._id);
          localStorage.setItem("name", data.userDetails.name);
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else if (data.role === "admin") {
          toast.success("Logged In success");
          localStorage.setItem("admin", data.userDetails.email);
          setTimeout(() => {
            navigate("/admin");
          }, 1000);
        }
      }
      if (data.userExists) {
        toast.error("User already Exists! Create a new User");
      }
      if (data.success === false) {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.log("ERR in SignUp", error);
    }
  }
  return (
    <div className="main">
      <Toaster />
      <div className="LoginMain">
        <h3 style={{ textAlign: "center", marginTop: "-30px" }}>
          Welcome to Library Management
        </h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group size="lg" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
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
          </Form.Group>
          <Button
            className="LoginButton"
            variant="success"
            block="true"
            size="lg"
            type="submit"
          >
            Login
            <RiLoginCircleFill />
          </Button>
          <p style={{ marginTop: "15px" }}>
            Not Already Have an account. <a href="/Signup">SignUp</a>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Login;
