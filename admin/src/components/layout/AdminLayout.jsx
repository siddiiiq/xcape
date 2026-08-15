import React from "react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-base">
    <Sidebar />
    <Topbar />
    <div className="md:pl-64">
      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-8 sm:py-8">{children}</main>
    </div>
  </div>
);

export default AdminLayout;
