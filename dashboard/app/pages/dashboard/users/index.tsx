import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import { fetchUsers } from "~/redux/features/userSlice";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { PaperWrapper } from "~/components/ui/paper-wrapper";
import { Users, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import type { UserStatus } from "~/types/user";

export default function UserList() {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleRetry = () => {
    dispatch(fetchUsers());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">Manage system users</p>
        </div>
        <Link to="/admin/users/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>User List</span>
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PaperWrapper
            loading={loading}
            loadingMessage="Loading users..."
            error={error ? new Error(error) : null}
            errorTitle="Failed to load users"
            onRetry={handleRetry}
            empty={!loading && users.length === 0}
            emptyMessage="No users found. Add your first user to get started."
            padding="none"
          >
            <div className="rounded-md border">
              <div className="p-4 bg-muted/50">
                <div className="grid grid-cols-5 font-medium text-sm">
                  <div>Name</div>
                  <div>Role</div>
                  <div>Email</div>
                  <div>Phone</div>
                  <div>Status</div>
                </div>
              </div>
              <div className="divide-y">
                {currentItems.length > 0 ? (
                  currentItems.map((user) => (
                    <div key={user.id} className="p-4 hover:bg-muted/50">
                      <div className="grid grid-cols-5 text-sm">
                        <div className="font-medium">{user.name}</div>
                        <div>{user.position ?? "-"}</div>
                        <div>{user.email}</div>
                        <div>{user.phone ?? "-"}</div>
                        <div>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(user.status)}`}
                          >
                            {user.status ?? "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No users found matching your search.
                  </div>
                )}
              </div>
            </div>

            {filteredUsers.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredUsers.length)} of{" "}
                  {filteredUsers.length} users
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="text-sm">
                    Page {currentPage} of {totalPages || 1}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </PaperWrapper>
        </CardContent>
      </Card>
    </div>
  );
}

function getStatusColor(status?: UserStatus) {
  switch (status) {
    case "Active":
      return "bg-green-50 text-green-700";
    case "Inactive":
      return "bg-red-50 text-red-700";
    case "Suspended":
      return "bg-yellow-50 text-yellow-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
}
