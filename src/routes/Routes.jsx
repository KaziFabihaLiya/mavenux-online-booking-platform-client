
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
import ManageTickets from "../pages/protected/Dashboard/Admin/ManageTickets";
import AllTickets from "../pages/public/AllTickets";
import DashboardLayout from "../pages/protected/Dashboard/DashboardLayout";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";


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
  { path: "/login", element: <LoginForm /> },
  { path: "/signup", element: <RegisterForm /> },
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
            
          </PrivateRoutes>
        ),
      },
      {
        path: "add-ticket",
        element: (
          <PrivateRoutes>
            
          </PrivateRoutes>
        ),
      },
      {
        path: "my-inventory",
        element: (
          <PrivateRoutes>
            
          </PrivateRoutes>
        ),
      },
      {
        path: "manage-users",
        element: (
          <PrivateRoutes>

          </PrivateRoutes>
        ),
      },
      {
        path: "seller-requests",
        element: (
          <PrivateRoutes>
           
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

              <ManageTickets />

          </PrivateRoutes>
        ),
      },
    ],
  },
]);
