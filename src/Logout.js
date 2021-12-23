import React, { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "./components/UserContext";
import Button from "./components/Button";
import Navbar from "./components/Navbar";

function Logout() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = () => {
    setUser();
    localStorage.clear();

    navigate("/", { replace: true });
  };

  return (
    <div id="logout">
      <Navbar />
      <Button handleClick={handleClick} label="Logout" />
    </div>
  );
}

export default Logout;
