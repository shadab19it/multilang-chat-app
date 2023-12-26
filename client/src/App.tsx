import { createBrowserRouter } from "react-router-dom";
import Chat from "./components/Chat/Chat";
import Join from "./components/Join/Join";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Join />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
]);

export default router;
