import React from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import CursorGlow from "../common/CursorGlow.jsx";

const Layout = ({ children }) => (
  <div className="grain min-h-screen bg-ink">
    <CursorGlow />
    <Navbar />
    {/* keep main unpadded — hero will handle offset so navbar visually overlaps the top */}
    <main className="pt-0">{children}</main>
    <Footer />
  </div>
);

export default Layout;
