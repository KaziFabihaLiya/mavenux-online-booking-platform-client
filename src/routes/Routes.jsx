
import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Error from "../components/common/Error";
import Home from "../pages/public/Home";
import TicketDetails from "../pages/protected/TicketDetails";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import PrivateRoutes from "./PrivateRoutes";
import MyBookedTickets from "../pages/protected/Dashboard/User/MyBookedTickets";
import Profile from "../pages/protected/Dashboard/User/Profile";
import ManageUsers from "../pages/protected/Dashboard/Admin/ManageUsers";
import ManageTickets from "../pages/protected/Dashboard/Admin/ManageTickets";
import AllTickets from "../pages/public/AllTickets";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/",
        element: <AllTickets />,
      },
      {
        path: "/",
        element: <TicketDetails />,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Register /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoutes>
        <DashboardLayout />
      </PrivateRoutes>
    ),
    children: [
      {
        index: true,
        element: (
          <PrivateRoutes>
            <Statistics />
          </PrivateRoutes>
        ),
      },
      {
        path: "add-plant",
        element: (
          <PrivateRoutes>
            <SellerRoute>
              <AddPlant />
            </SellerRoute>
          </PrivateRoutes>
        ),
      },
      {
        path: "my-inventory",
        element: (
          <PrivateRoutes>
            <SellerRoute>
              <MyInventory />
            </SellerRoute>
          </PrivateRoutes>
        ),
      },
      {
        path: "manage-users",
        element: (
          <PrivateRoutes>
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          </PrivateRoutes>
        ),
      },
      {
        path: "seller-requests",
        element: (
          <PrivateRoutes>
            <AdminRoute>
              <SellerRequests />
            </AdminRoute>
          </PrivateRoutes>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoutes>
            <Profile />
          </PrivateRoutes>
        ),
      },
      {
        path: "my-booked-tickets",
        element: (
          <PrivateRoutes>
            <MyBookedTickets />
          </PrivateRoutes>
        ),
      },
      {
        path: "manage-tickets",
        element: (
          <PrivateRoutes>
            <SellerRoute>
              <ManageTickets />
            </SellerRoute>
          </PrivateRoutes>
        ),
      },
    ],
  },
]);
