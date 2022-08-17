import "./App.css";
import React from "react";
import library from "./images/lib1.jpg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Admin from "./components/Admin/Admin";
import UserInterface from "./components/UserInterface/UserInterface";
import Home from "./components/BooksHome/Home";
import Navbars from "./components/Navbar/Navbars";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import BookDetails from "./components/BookDetails/BookDetails";

function App() {
  return (
    <div
      style={{
        backgroundImage: `url('${library}')`,
        backgroundPosition: "top",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        minHeight: "1000px",
      }}
      className="App"
    >
      <div>
        <BrowserRouter>
          <Navbars />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/Signup" element={<Signup />} />
            <Route exact path="/userinterface" element={<UserInterface />} />
            <Route exact path="/admin" element={<Admin />} />
            <Route exact path="/bookDetails/:id" element={<BookDetails />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
