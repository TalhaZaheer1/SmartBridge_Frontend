import { Routes, Route, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { SidebarProvider } from "../../components/SidebarContext";

import AdminDashboard from "./Admin/AdminDashboard";
import Users from "./Admin/Users";
import SideBarHeader from "../../components/SideBarHeader"
import AdminProducts from "./Admin/AdminProducts";
import AdminOrders from "./Admin/AdminOrders";
import AdminPaymentPage from './Admin/AdminPaymentPage';

const Dashboard = () => {
  const { role } = useParams();

  const roleRoutes = {
    admin: (
      <>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />

        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />

        <Route path="payment" element={<AdminPaymentPage />} />
      </>
    ),
  };

  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar />
        <div className="ml-16 md:ml-64 w-full p-4 space-y-6">
          <SideBarHeader />
          <Routes>{roleRoutes[role]}</Routes>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
