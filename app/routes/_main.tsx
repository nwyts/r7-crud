import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="min-h-screen">
      <div className="max-w-lg mx-auto py-20">
        <Outlet />
      </div>
    </div>
  );
}
