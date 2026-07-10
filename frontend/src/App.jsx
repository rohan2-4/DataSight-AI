import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
function App(){
  return(
    <div>
      <AppRoutes />
      <ToastContainer 
            position="top-right"
           autoClose={3000}
            hideProgressBar={false}
            newestOnTop
          closeOnClick
          pauseOnHover
        theme="colored"      
      />
    </div>
  );
}
export default App;