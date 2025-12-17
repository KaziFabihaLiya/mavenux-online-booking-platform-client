
import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/public/Home";
import TicketDetails from "../pages/protected/TicketDetails";
import PrivateRoutes from "./PrivateRoutes";
import MyBookedTickets from "../pages/protected/Dashboard/User/MyBookedTickets";
import Profile from "../pages/protected/Dashboard/User/Profile";
import ManageTickets from "../pages/protected/Dashboard/Admin/ManageTickets";
import AllTickets from "../pages/public/AllTickets";
import DashboardLayout from "../pages/protected/Dashboard/DashboardLayout";
// Public Pages

// User Dashboard
import TransactionHistory from "../pages/protected/Dashboard/User/TransactionHistory";
// Vendor Dashboard
import AddTicket from "../pages/protected/Dashboard/Vendor/AddTicket";
import MyAddedTickets from "../pages/protected/Dashboard/Vendor/MyAddedTickets";
import RequestedBookings from "../pages/protected/Dashboard/Vendor/RequestedBookings";
import RevenueOverview from "../pages/protected/Dashboard/Vendor/RevenueOverview";
// Admin Dashboard
import ManageUsers from "../pages/protected/Dashboard/Admin/ManageUsers";
import AdvertiseTickets from "../pages/protected/Dashboard/Admin/AdvertiseTickets";
// Payment
import PaymentSuccess from "../pages/protected/PaymentSuccess";
import PaymentCancel from "../pages/protected/PaymentCancel";
import NotFound from "../pages/public/NotFound";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";
import ForgetPassword from "../components/common/ForgotPassword";
import AdminRoute from "./AdminRoute";
import VendorRoute from "./VendorRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Public Routes
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/all-tickets",
        element: <AllTickets />,
      },
      {
        path: "/tickets/:id",
        element: (
          <PrivateRoutes>
            <TicketDetails />
          </PrivateRoutes>
        ),
      },
      {
        path: "/login",
        element: <LoginForm />,
      },
      {
        path: "/register",
        element: <RegisterForm />,
      },
      {
        path: "/forgot-password",
        element: <ForgetPassword />,
      },
    ],
  },

  // Dashboard Routes (Protected)
  {
    path: "/dashboard",
    element: (
      <PrivateRoutes>
        <DashboardLayout />
      </PrivateRoutes>
    ),
    children: [
      // USER ROUTES
      {
        path: "user/profile",
        element: (
          <PrivateRoutes>
              <Profile />
          </PrivateRoutes>
        ),
      },
      {
        path: "user/bookings",
        element: (
          <PrivateRoutes>
              <MyBookedTickets />
          </PrivateRoutes>
        ),
      },
      {
        path: "user/transactions",
        element: (
          <PrivateRoutes>
              <TransactionHistory />
          </PrivateRoutes>
        ),
      },

      // VENDOR ROUTES
      {
        path: "vendor/profile",
        element: (
          <PrivateRoutes>
            <VendorRoute>
              <Profile />
            </VendorRoute>
          </PrivateRoutes>
        ),
      },
      {
        path: "vendor/add-ticket",
        element: (
          <PrivateRoutes>
            <VendorRoute>
              <AddTicket />
            </VendorRoute>
          </PrivateRoutes>
        ),
      },
      {
        path: "vendor/my-tickets",
        element: (
          <PrivateRoutes>
            <VendorRoute>
              <MyAddedTickets />
            </VendorRoute>
          </PrivateRoutes>
        ),
      },
      {
        path: "vendor/bookings",
        element: (
          <PrivateRoutes>
            <VendorRoute>
              <RequestedBookings />
            </VendorRoute>
          </PrivateRoutes>
        ),
      },
      {
        path: "vendor/revenue",
        element: (
          <PrivateRoutes>
          <VendorRoute>
            <RevenueOverview />
          </VendorRoute>
          </PrivateRoutes>
        ),
      },

      // ADMIN ROUTES
      {
        path: "admin/profile",
        element: (
          <PrivateRoutes>
            <AdminRoute>
              <Profile />
            </AdminRoute>
          </PrivateRoutes>
        ),
      },
      {
        path: "admin/manage-tickets",
        element: (
          <PrivateRoutes>
            <AdminRoute>
              <ManageTickets />
            </AdminRoute>
          </PrivateRoutes>
        ),
      },
      {
        path: "admin/manage-users",
        element: (
          <PrivateRoutes>
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          </PrivateRoutes>
        ),
      },
      {
        path: "admin/advertise",
        element: (
          <PrivateRoutes>
            <AdminRoute>
              <AdvertiseTickets />
            </AdminRoute>
          </PrivateRoutes>
        ),
      },
    ],
  },

  // Payment Routes
  {
    path: "/payment/success",
    element: (
      <PrivateRoutes>
        <PaymentSuccess />
      </PrivateRoutes>
    ),
  },
  {
    path: "/payment/cancel",
    element: (
      <PrivateRoutes>
        <PaymentCancel />
      </PrivateRoutes>
    ),
  },

  // 404
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;