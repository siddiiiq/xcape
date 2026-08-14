import React from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import CursorGlow from "../common/CursorGlow.jsx";

const Layout = ({ children }) => (
  <div className="grain min-h-screen bg-ink">
    <CursorGlow />
    <Navbar />
    <main>{children}</main>
    <Footer />
  </div>
);

export default Layout;
