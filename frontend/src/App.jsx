import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./Routes/index";
import Loader from "./components/Loader/Loader";


function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <AppRoutes />
    </div>
  );
}

export default App;