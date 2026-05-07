import { Link } from "react-router";
import { LayoutDashboard, Users, UserCircle, LogOut, Settings } from "lucide-react";
import { appConfig } from "~/config/app.config";

export default function Sidebar() {
  return (
    <div className="w-64 bg-card border-r">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-black">{appConfig.name}</h2>
        <nav className="space-y-4">
          {/* Main Navigation */}
          <div>
            <Link to="/admin" className="flex items-center p-2 rounded-md hover:bg-accent">
              <LayoutDashboard className="w-5 h-5 mr-2" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </div>

          {/* User Management */}
          <div>
            <h3 className="text-base font-bold text-black mb-1">User Management</h3>
            <div className="space-y-1">
              <Link to="/admin/users" className="flex items-center p-1 rounded-md hover:bg-accent pl-3">
                <Users className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">Users</span>
              </Link>
            </div>
          </div>

          {/* Settings */}
          <div>
            <h3 className="text-base font-bold text-black mb-1">Settings</h3>
            <div className="space-y-1">
              <Link to="/admin/profile" className="flex items-center p-1 rounded-md hover:bg-accent pl-3">
                <UserCircle className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">Profile</span>
              </Link>
              <Link to="/admin/settings" className="flex items-center p-1 rounded-md hover:bg-accent pl-3">
                <Settings className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">Settings</span>
              </Link>
              <Link to="/login" className="flex items-center p-1 rounded-md hover:bg-accent pl-3">
                <LogOut className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">Logout</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
