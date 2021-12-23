import React, { useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Login from "./Login";
import Register from "./Register";
import { UserContext } from "./components/UserContext";
import Logout from "./Logout";
import About from "./About";
import Profile from "./Profile";

function AppRouter() {
  const [user, setUser] = useState(null);

  const providerValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <BrowserRouter>
      <UserContext.Provider value={providerValue}>
        <Routes>
          <Route path="/home" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" exactly element={<Navigate to={"/home"} />} />
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default AppRouter;
