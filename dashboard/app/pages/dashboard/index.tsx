import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Users, Activity, CheckCircle, ArrowRight } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here's an overview of your application
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link to="/admin/users">
              <Button variant="outline" className="w-full justify-between">
                Manage Users
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/admin/users/create">
              <Button variant="outline" className="w-full justify-between">
                Add New User
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/admin/profile">
              <Button variant="outline" className="w-full justify-between">
                Edit Profile
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This is a generic React starter kit. Customize this dashboard to fit your application needs.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Authentication system with Redux state management</li>
              <li>User management with CRUD operations</li>
              <li>Form validation with React Hook Form and Zod</li>
              <li>Responsive UI with Tailwind CSS and shadcn/ui</li>
              <li>Type-safe API layer with TypeScript</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
