import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Scaffoldz</h1>
      <Outlet />
    </div>
  );
}

export default AuthLayout;
