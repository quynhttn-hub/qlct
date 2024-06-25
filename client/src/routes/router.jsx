import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/Home';
import Chats from './Chats';
import Landing from '../components/Landing/Landing';
import Login from '../components/Login';
import Signup from '../components/Signup';
import MyBot from './MyBot';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        children: [
            {
                path: "",
                element: <Landing />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "signup",
                element: <Signup />
            },
            {
                path: "chats",
                element: <Chats />
            },
            {
                path: "mybot",
                element: <MyBot/>
            },
            

        ]
    },
]);

export default router
