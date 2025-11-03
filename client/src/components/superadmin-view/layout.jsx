import { Outlet } from "react-router-dom";
import SuperAdminSideBar from "./sidebar";
import SuperAdminHeader from "./header";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAdminProfile } from "@/store/admin/profile-slice";

function SuperAdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAdminProfile());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen w-full">
      {/* superadmin sidebar */}
      <SuperAdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        {/* superadmin header */}
        <SuperAdminHeader setOpen={setOpenSidebar} />
        <main className="flex-1 flex-col flex bg-gradient-to-br from-blue-50/50 to-yellow-50/30 dark:from-muted/20 dark:to-background p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SuperAdminLayout;

