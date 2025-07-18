import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Buy from "../pages/Buy";
import Cart from "../pages/Cart";
import OrderDetails from "../components/OrderDetails";
import Payment from "../pages/Payment";
import OrderConfirmation from "../pages/OrderConfirmation";
import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";
import ForgotPassword from "../components/ForgotPassword";
import AccountPage from "../pages/AccountPage";
import CustomersTable from "../components/CustomersTable";
import AddProduct from "../components/AddProduct";
import ProductDashboard from "../components/ProductDashboard";
import AllOrders from "../components/AllOrders";
import ViewProductPage from "../components/ViewProductPage";
import UpdateProduct from "../components/UpdateProduct";
import ViewOrder from "../components/ViewOrder"
import AdminDashboard from "../components/AdminDashboard";



export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/', index: true, element: <Home /> },
            { path: '/shop', element: <Shop /> },
            { path: '/cart', element: <Cart /> },
            { path: '/checkout', element: <Buy /> },
            { path: '/orders', element: <OrderDetails /> },
            { path: '/payments', element: <Payment /> },
           { path: '/order-success/:id', element: <OrderConfirmation /> },
            { path: '/signup', element: <SignUp /> },
            { path: '/signin', element: <SignIn /> },
            { path: '/forgotpassword', element: <ForgotPassword /> },
            { path: '/account', element: <AccountPage />},
            { path: '/customersdata', element:<CustomersTable />},
            { path: '/addproduct', element:<AddProduct />},
            { path: '/products', element:<ProductDashboard />},
            { path: '/allorders', element:<AllOrders />},
            { path: '/products/:id', element: <ViewProductPage />},
            { path: '/update/:id', element: <UpdateProduct />},
            { path: '/orders/:orderId', element: <ViewOrder />},
            { path: '/admin', element: <AdminDashboard />},
           
           
        ]

    },
])