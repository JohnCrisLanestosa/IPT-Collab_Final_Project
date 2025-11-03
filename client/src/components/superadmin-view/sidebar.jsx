import {
  LayoutDashboard,
  ShieldCheck,
  User,
  ShoppingBasket,
  BadgeCheck,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const superAdminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/superadmin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "admins",
    label: "Manage Admins",
    path: "/superadmin/admins",
    icon: <ShieldCheck />,
  },
  {
    id: "products",
    label: "Products",
    path: "/superadmin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/superadmin/orders",
    icon: <BadgeCheck />,
  },
  {
    id: "profile",
    label: "My Profile",
    path: "/superadmin/profile",
    icon: <User />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {superAdminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
          className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-secondary/20 dark:hover:bg-accent/20 hover:text-primary dark:hover:text-accent transition-all duration-300 ease-in-out hover:translate-x-1 hover:scale-105"
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function SuperAdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <ShieldCheck size={30} className="text-secondary" />
                <h1 className="text-2xl font-extrabold">Super Admin</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 flex-col border-r bg-gradient-to-b from-white to-blue-50 dark:from-card dark:to-background p-6 lg:flex shadow-md">
        <div
          onClick={() => navigate("/superadmin/dashboard")}
          className="flex cursor-pointer items-center gap-2 transition-all duration-300 ease-in-out hover:scale-105 text-primary"
        >
          <ShieldCheck size={30} className="text-secondary dark:text-accent" />
          <h1 className="text-2xl font-extrabold">Super Admin</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default SuperAdminSideBar;

