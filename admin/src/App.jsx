import React from "react";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./components/common/Toast.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Places from "./pages/Places.jsx";
import PlaceCreate from "./pages/PlaceCreate.jsx";
import PlaceEdit from "./pages/PlaceEdit.jsx";
import Trips from "./pages/Trips.jsx";
import Bookings from "./pages/Bookings.jsx";
import Customers from "./pages/Customers.jsx";
import Stories from "./pages/Stories.jsx";
import Reels from "./pages/Reels.jsx";
import YouTube from "./pages/YouTube.jsx";
import Founders from "./pages/Founders.jsx";
import Members from "./pages/Members.jsx";
import Media from "./pages/Media.jsx";
import Settings from "./pages/Settings.jsx";

const Protected = ({ children }) => (
  <ProtectedRoute>
    <AdminLayout>{children}</AdminLayout>
  </ProtectedRoute>
);

const App = () => (
  <AuthProvider>
    <ToastProvider>
      <Routes>
        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin" element={<Protected><Dashboard /></Protected>} />
        <Route path="/admin/places" element={<Protected><Places /></Protected>} />
        <Route path="/admin/places/new" element={<Protected><PlaceCreate /></Protected>} />
        <Route path="/admin/places/:id/edit" element={<Protected><PlaceEdit /></Protected>} />
        <Route path="/admin/trips" element={<Protected><Trips /></Protected>} />
        <Route path="/admin/bookings" element={<Protected><Bookings /></Protected>} />
        <Route path="/admin/customers" element={<Protected><Customers /></Protected>} />
        <Route path="/admin/stories" element={<Protected><Stories /></Protected>} />
        <Route path="/admin/reels" element={<Protected><Reels /></Protected>} />
        <Route path="/admin/youtube" element={<Protected><YouTube /></Protected>} />
        <Route path="/admin/founders" element={<Protected><Founders /></Protected>} />
        <Route path="/admin/members" element={<Protected><Members /></Protected>} />
        <Route path="/admin/media" element={<Protected><Media /></Protected>} />
        <Route path="/admin/settings" element={<Protected><Settings /></Protected>} />

        <Route path="*" element={<Protected><Dashboard /></Protected>} />
      </Routes>
    </ToastProvider>
  </AuthProvider>
);

export default App;
