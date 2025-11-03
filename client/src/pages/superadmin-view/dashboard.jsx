import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserStatistics } from "@/store/superadmin/admin-slice";
import { ShieldCheck, Users, UserCog, UsersRound } from "lucide-react";

function SuperAdminDashboard() {
  const dispatch = useDispatch();
  const { statistics, isLoading } = useSelector((state) => state.superAdmin);

  useEffect(() => {
    dispatch(getUserStatistics());
  }, [dispatch]);

  const stats = [
    {
      title: "Total Users",
      value: statistics.totalUsers,
      icon: <Users className="h-8 w-8 text-primary" />,
      description: "Regular customers",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Total Admins",
      value: statistics.totalAdmins,
      icon: <UserCog className="h-8 w-8 text-secondary" />,
      description: "Admin accounts",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      title: "Super Admins",
      value: statistics.totalSuperAdmins,
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      description: "Super admin accounts",
      bgColor: "bg-blue-100 dark:bg-blue-800/20",
    },
    {
      title: "Total Accounts",
      value: statistics.totalAll,
      icon: <UsersRound className="h-8 w-8 text-secondary" />,
      description: "All system users",
      bgColor: "bg-yellow-100 dark:bg-yellow-800/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-primary mb-2">
          Super Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome to the Super Admin control panel. Manage admins and monitor system statistics.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`${stat.bgColor} border-2 hover:shadow-lg transition-all duration-300 hover:scale-105`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {isLoading ? "..." : stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Super Admin Privileges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-secondary mt-2" />
            <div>
              <h3 className="font-semibold text-foreground">Create & Manage Admins</h3>
              <p className="text-sm text-muted-foreground">
                Add new admin accounts and manage existing administrators
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-secondary mt-2" />
            <div>
              <h3 className="font-semibold text-foreground">View All Users</h3>
              <p className="text-sm text-muted-foreground">
                Monitor all user accounts and their activities
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-secondary mt-2" />
            <div>
              <h3 className="font-semibold text-foreground">System Control</h3>
              <p className="text-sm text-muted-foreground">
                Full access to all administrative functions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Welcome Message */}
      <Card className="border-2 border-secondary/30 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold text-primary mb-3">
            Welcome to Super Admin Panel 👑
          </h2>
          <p className="text-muted-foreground mb-4">
            You have complete control over the system. Use the sidebar navigation to access different management sections.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-secondary">▸</span>
              Navigate to <strong>Manage Admins</strong> to create or modify admin accounts
            </li>
            <li className="flex items-center gap-2">
              <span className="text-secondary">▸</span>
              Check <strong>All Users</strong> to monitor customer accounts
            </li>
            <li className="flex items-center gap-2">
              <span className="text-secondary">▸</span>
              Access all features available to regular admins plus exclusive super admin tools
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default SuperAdminDashboard;

