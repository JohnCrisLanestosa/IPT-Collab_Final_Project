import { AlignJustify, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import ThemeToggle from "../common/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

function SuperAdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.adminProfile);

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 border-b-2 border-secondary/30 shadow-sm">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block bg-secondary hover:bg-accent">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end items-center gap-3">
        <ThemeToggle className="bg-secondary/20 hover:bg-secondary/30" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-primary border-2 border-secondary hover:border-accent transition-colors cursor-pointer">
              {profile?.profilePicture ? (
                <AvatarImage src={profile.profilePicture} alt={user?.userName} />
              ) : null}
              <AvatarFallback className="bg-primary text-secondary font-extrabold">
                {user?.userName?.[0]?.toUpperCase() || "S"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-56">
            <DropdownMenuLabel>
              {user?.userName}
              <div className="text-xs text-muted-foreground font-normal">
                Super Admin
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/superadmin/profile")}>
              <UserIcon className="mr-2 h-4 w-4" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default SuperAdminHeader;

