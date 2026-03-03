import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

  const getBackgroundClass = () => {
    switch (location.pathname) {
      case "/login":
        return "bg-login";
      case "/chat":
        return "bg-chat";
      default:
        return "bg-home";
    }
  };

  return (
    <div className={`app-container ${getBackgroundClass()}`}>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
