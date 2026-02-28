import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="min-h-screen">
      <div className="max-w-xl mx-auto py-20">
        <Outlet />
      </div>
    </div>
  );
}
