import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-white to-blue-50 dark:from-background dark:via-card dark:to-background">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full flex-1 pt-16">
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;
