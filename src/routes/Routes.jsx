
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
import RoleRoute from "./RoleRoute";
import PaymentCancel from "../pages/protected/PaymentCancel";
import NotFound from "../pages/public/NotFound";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";

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
          <RoleRoute allowedRoles={["user", "vendor", "admin"]}>
            <Profile />
          </RoleRoute>
        ),
      },
      {
        path: "user/bookings",
        element: (
          <RoleRoute allowedRoles={["user"]}>
            <MyBookedTickets />
          </RoleRoute>
        ),
      },
      {
        path: "user/transactions",
        element: (
          <RoleRoute allowedRoles={["user"]}>
            <TransactionHistory />
          </RoleRoute>
        ),
      },

      // VENDOR ROUTES
      {
        path: "vendor/profile",
        element: (
          <RoleRoute allowedRoles={["vendor", "admin"]}>
            <Profile />
          </RoleRoute>
        ),
      },
      {
        path: "vendor/add-ticket",
        element: (
          <RoleRoute allowedRoles={["vendor"]}>
            <AddTicket />
          </RoleRoute>
        ),
      },
      {
        path: "vendor/my-tickets",
        element: (
          <RoleRoute allowedRoles={["vendor"]}>
            <MyAddedTickets />
          </RoleRoute>
        ),
      },
      {
        path: "vendor/bookings",
        element: (
          <RoleRoute allowedRoles={["vendor"]}>
            <RequestedBookings />
          </RoleRoute>
        ),
      },
      {
        path: "vendor/revenue",
        element: (
          <RoleRoute allowedRoles={["vendor"]}>
            <RevenueOverview />
          </RoleRoute>
        ),
      },

      // ADMIN ROUTES
      {
        path: "admin/profile",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <Profile />
          </RoleRoute>
        ),
      },
      {
        path: "admin/manage-tickets",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <ManageTickets />
          </RoleRoute>
        ),
      },
      {
        path: "admin/manage-users",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <ManageUsers />
          </RoleRoute>
        ),
      },
      {
        path: "admin/advertise",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <AdvertiseTickets />
          </RoleRoute>
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