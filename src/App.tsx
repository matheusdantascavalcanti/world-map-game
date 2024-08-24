import React from "react";
import WorldMap from "./WorldMap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  
import "./App.css";

function App() {
  return (
    <div className="App">
      <WorldMap />
      <ToastContainer
        position="top-right" 
        autoClose={1000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable
        pauseOnHover 
      />
    </div>
  );
}

export default App;
