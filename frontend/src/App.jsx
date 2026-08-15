import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Layout from "./components/layout/Layout.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import { CustomerAuthProvider } from "./context/CustomerAuthContext.jsx";
import ProtectedCustomerRoute from "./components/common/ProtectedCustomerRoute.jsx";

import Home from "./pages/Home.jsx";
import Places from "./pages/Places.jsx";
import PlaceDetails from "./pages/PlaceDetails.jsx";
import Stories from "./pages/Stories.jsx";
import StoryDetails from "./pages/StoryDetails.jsx";
import Founders from "./pages/Founders.jsx";
import FounderDetails from "./pages/FounderDetails.jsx";
import Reels from "./pages/Reels.jsx";
import YouTube from "./pages/YouTube.jsx";
import Join from "./pages/Join.jsx";
import NotFound from "./pages/NotFound.jsx";

import SignIn from "./pages/SignIn.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Account from "./pages/Account.jsx";
import AccountProfile from "./pages/AccountProfile.jsx";
import AccountBookings from "./pages/AccountBookings.jsx";
import AccountBookingDetail from "./pages/AccountBookingDetail.jsx";
import Trips from "./pages/Trips.jsx";
import TripDetails from "./pages/TripDetails.jsx";

/**
 * Automatically scroll to the top whenever the route changes.
 *
 * This handles:
 * - Clicking navigation links
 * - Going to another page
 * - Browser back/forward navigation
 * - Refreshing a page
 * - Dynamic routes such as /places/:slug
 * - Dynamic routes such as /trips/:slug
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
};

const App = () => (
  <SettingsProvider>
    <CustomerAuthProvider>
      <Layout>
        {/* Keeps every route change at the top of the page */}
        <ScrollToTop />

        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/places" element={<Places />} />
          <Route path="/places/:slug" element={<PlaceDetails />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/stories/:slug" element={<StoryDetails />} />
          <Route path="/founders" element={<Founders />} />
          <Route path="/founders/:slug" element={<FounderDetails />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/youtube" element={<YouTube />} />
          <Route path="/join" element={<Join />} />

          {/* Trips — browsing is public, booking is gated inside BookingWidget */}
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/:slug" element={<TripDetails />} />

          {/* Customer auth */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Customer account (protected) */}
          <Route
            path="/account"
            element={
              <ProtectedCustomerRoute>
                <Account />
              </ProtectedCustomerRoute>
            }
          />

          <Route
            path="/account/profile"
            element={
              <ProtectedCustomerRoute>
                <AccountProfile />
              </ProtectedCustomerRoute>
            }
          />

          <Route
            path="/account/bookings"
            element={
              <ProtectedCustomerRoute>
                <AccountBookings />
              </ProtectedCustomerRoute>
            }
          />

          <Route
            path="/account/bookings/:id"
            element={
              <ProtectedCustomerRoute>
                <AccountBookingDetail />
              </ProtectedCustomerRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </CustomerAuthProvider>
  </SettingsProvider>
);

export default App;