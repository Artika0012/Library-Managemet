import React, { useEffect, useState } from "react";
import "./UserInterface.css";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FileBase64 from "react-file-base64";
import { url } from "../url";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { MdUpdate } from "react-icons/md";

const UserInterface = () => {
  const [formValues, setformValues] = useState();
  const [pageRefresh, setpageRefresh] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [allData, setallData] = React.useState(false);
  const [showData, setshowData] = React.useState(false);

  let navigate = useNavigate();
  useEffect(() => {
    let user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    } else {
      get_DataForupdateProfile();
    }
  }, [pageRefresh]);

  const id = localStorage.getItem("id");
  const name = localStorage.getItem("name");
  // get data later on for profile udpate
  const get_DataForupdateProfile = async (clicker) => {
    if (clicker === "clicker") {
      setModalShow(true);
      setpageRefresh(!pageRefresh);
    }
    try {
      const { data } = await axios.get(`${url}/user/getProfileData/${id}`);
      if (data.success) {
        setallData(data.data);
        // setpageRefresh(!pageRefresh);
      } else if (data.success === false) {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error("Internal server error");
    }
  };
  //
  // update the profile
  const updateProfile = async () => {
    try {
      const resp = await axios.post(
        `${url}/user/profileupdate/${id}`,
        formValues
      );
      if (resp.data.success) {
        toast.success(resp.data.message);
        setModalShow(false);
        setpageRefresh(!pageRefresh);
        setshowData(resp.data.data);
        console.log(resp.data.data);
      } else if (resp.data.success === false) {
        toast.error(resp.data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error("Internal server error");
    }
  };
  return (
    <div>
      {/* section 1 contains pic and name and description */}
      <Toaster />
      <div style={{ paddingTop: "30px" }}>
        <div
          style={{
            background: "white",
            display: "flex",
            justifyContent: "center",
            width: "50%",
            margin: "auto",
            padding: "60px",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {!allData.image && (
              <p style={{ color: "red" }}>*Please edit your profile</p>
            )}
            {allData && (
              <img
                style={{
                  borderRadius: "100px",
                  border: "3px solid rgb(25,135,84)",
                }}
                src={allData.image}
                width={"130px"}
                height={"130px"}
              />
            )}

            {/* Username */}
            <div>
              <h2>{allData?.name}</h2>
            </div>
            {/* user bio */}
            <div style={{ width: "50%" }}>
              <span style={{ fontSize: "large", fontWeight: "bold" }}>
                {" "}
                About:{" "}
              </span>
              <p>{allData?.about}</p>
            </div>
            {/* phone no */}
            <div>
              <p style={{ textAlign: "left" }}>
                Phone No. {allData && allData?.phone}
              </p>
            </div>
            {/* AGE WIEGHT HEIGHT */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <p className="age">Age</p>
              <p className="wieght">Weight</p>
              <p className="hieght">Height</p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <p>{allData?.age} years</p>
              <p>{allData?.weight} kg</p>
              <p>{allData?.height} ft'</p>
            </div>
            <div style={{ marginRight: "auto" }}>
              <Button
                onClick={() => get_DataForupdateProfile("clicker")}
                className="text-center"
                variant="success"
                style={{ marginLeft: 4 }}
              >
                <MdUpdate /> Edit My Profile Info
              </Button>
            </div>
          </div>
          {/* update profile modal */}
          <Modal
            show={modalShow}
            onHide={() => setModalShow(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Update Your profile</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <FileBase64
                multiple={false}
                onDone={(file) =>
                  setformValues({ ...formValues, image: file.base64 })
                }
              />
              {/* user about section */}
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Write About Yourself:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  name="address"
                  placeholder="User Bio"
                  onChange={(e) =>
                    setformValues({ ...formValues, about: e.target.value })
                  }
                  defaultValue={allData?.about}
                />
              </Form.Group>
              {/* phone no*/}
              <p>Phone number</p>
              <input
                onChange={(e) =>
                  setformValues({ ...formValues, phone: e.target.value })
                }
                type="tel"
                placeholder="Enter Your Phone Number"
                defaultValue={allData?.phone}
              />

              {/* Age*/}
              <p>Enter Your Age:</p>
              <input
                type="number"
                onChange={(e) =>
                  setformValues({ ...formValues, age: e.target.value })
                }
                placeholder="age"
                defaultValue={allData?.age}
              />

              {/* wieght*/}
              <p>Enter Your Weight:</p>
              <input
                type="number"
                onChange={(e) =>
                  setformValues({ ...formValues, weight: e.target.value })
                }
                placeholder="Weight"
                defaultValue={allData?.weight}
              />

              {/*hieght*/}
              <p>Enter Your Height:</p>
              <input
                type="number"
                onChange={(e) =>
                  setformValues({ ...formValues, height: e.target.value })
                }
                placeholder="Height"
                defaultValue={allData?.height}
              />
            </Modal.Body>

            <Modal.Footer>
              <Button onClick={() => setModalShow(false)} variant="secondary">
                Close
              </Button>
              <Button variant="primary" onClick={() => updateProfile()}>
                Save changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default UserInterface;
