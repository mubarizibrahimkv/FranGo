import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketProvider } from "./utils/socketProvider";

const App = () => {
  return (
    <>
      <SocketProvider>
        <AppRoutes />
      </SocketProvider>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        pauseOnHover={false}
        draggable={true}
        theme="dark"
      />
    </>
  );
};

export default App;
