import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-blue-800 dark:from-primary dark:via-card dark:to-primary/80 w-1/2 px-12">
        <div className="max-w-md space-y-6 text-center text-white dark:text-blue-100">
          <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">
            Welcome to <span className="text-secondary dark:text-accent">BukSu EEU</span>
          </h1>
          <p className="text-lg text-blue-100 dark:text-blue-200">
            Your trusted marketplace for excellence
          </p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-background to-blue-50 dark:from-background dark:to-card px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
