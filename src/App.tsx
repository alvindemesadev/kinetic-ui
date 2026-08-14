import SkeuomorphicKit from "./SkeuomorphicKit";
import LandingPage from "./LandingPage";
import { Toaster } from "./components/ui/toast";

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

  return (
    <>
      {pathname === "/landing" ? <LandingPage /> : <SkeuomorphicKit />}
      <Toaster />
    </>
  );
}
