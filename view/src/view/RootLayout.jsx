import Footer from "./footer/Footer";
import Navbar from "./navBar/navbar";
import Sidebar from "./sidebar";

function RootLayout({ children }) {
  return (
    <div className="flex gap-4 funds-bg">
      <Sidebar />
      <div className="navbar-position">
        <Navbar />
        <div className="sub-Navbar">{children}</div>
        {/* <Footer /> */}
      </div>
    </div>
  );
}

export default RootLayout;
