import { Outlet, useNavigation } from "react-router";
import Navbar from "../pages/Shared/Navbar/Navbar";
import Footer from "../pages/Shared/Footer/Footer";
import ErrorLoadingState from "../components/ErrorLoadingState";

const RootLayout = () => {
  const navigation = useNavigation();
  return (
    <div>
      <Navbar></Navbar>
      <main className="min-h-screen">
        {navigation?.state === "loading" ? (
          <ErrorLoadingState isPending={true}></ErrorLoadingState>
        ) : (
          <Outlet></Outlet>
        )}
      </main>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;
