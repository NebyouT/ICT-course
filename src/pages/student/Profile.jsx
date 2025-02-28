import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import { toast } from "sonner";

const Profile = () => {
  const { data, isLoading, refetch } = useLoadUserQuery();
  const { data: purchaseData } = useGetPurchasedCoursesQuery();
  const user = data?.user || {};
  const [open, setOpen] = useState(false);
  
  const [name, setName] = useState(user?.name || "");
  const [profilePhoto, setProfilePhoto] = useState("");

  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);
    await updateUser(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(updateUserData?.message || "Profile updated successfully");
      refetch();
      setOpen(false); // Close dialog on success
    }
    if (isError) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  }, [isSuccess, isError]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Format the date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get enrolled courses count from purchase data
  const enrolledCoursesCount = purchaseData?.purchasedCourse?.length || 0;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100 via-white to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 -z-10 blur-3xl opacity-30 dark:opacity-20">
            <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-purple-500 to-indigo-500 opacity-30"></div>
          </div>
          <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 inline-block mb-4">
            My Profile
          </span>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent mb-4">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Content */}
        <div className="max-w-3xl mx-auto">
          <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-xl border border-purple-100 dark:border-purple-900/20 p-8">
            <div className="flex flex-col items-center space-y-6">
              {/* Avatar */}
              <Avatar className="h-24 w-24 ring-4 ring-purple-500/20">
                <AvatarImage
                  src={user?.photoUrl || "https://github.com/shadcn.png"}
                  alt={user?.name}
                />
                <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 text-2xl">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {user?.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                <p className="text-sm text-purple-600 dark:text-purple-400 capitalize mt-1">
                  {user?.role}
                </p>
              </div>

              {/* Edit Profile Button */}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-purple-100 dark:border-purple-900/20">
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border-purple-100 dark:border-purple-900/20 focus:ring-purple-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="picture">Profile Photo</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        id="picture"
                        onChange={onChangeHandler}
                        className="border-purple-100 dark:border-purple-900/20 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={updateUserHandler}
                      disabled={updateUserIsLoading}
                      className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                    >
                      {updateUserIsLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Additional Info */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-2xl p-6 border border-purple-100 dark:border-purple-900/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Enrolled Courses
                </h3>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {enrolledCoursesCount}
                </p>
              </div>
              <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-2xl p-6 border border-purple-100 dark:border-purple-900/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Member Since
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {formatDate(user?.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
