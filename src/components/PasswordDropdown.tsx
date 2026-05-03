import { useState } from "react";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

interface PasswordDropdownProps {
  onClose: () => void;
}

export default function PasswordDropdown({ onClose }: PasswordDropdownProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
      });

      if (error) {
        if (error.message?.includes("incorrect") || error.message?.includes("invalid")) {
          setError("Current password is incorrect");
        } else {
          setError(error.message ?? "Failed to change password. Please try again");
        }
        setLoading(false);
      } else {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(onClose, 2000);
      }
    } catch {
      setError("Unable to connect. Please try again");
      setLoading(false);
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-full max-w-sm sm:w-80 border-2 border-gray-400 bg-white z-50">
      <div className="border-b-2 border-gray-400 px-6 py-4">
        <h3 className="text-lg font-bold">Change Password</h3>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-bold text-gray-700">
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="mt-1 w-full border-2 border-gray-400 px-4 py-3 text-base focus:border-teal-600 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-bold text-gray-700">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="mt-1 w-full border-2 border-gray-400 px-4 py-3 text-base focus:border-teal-600 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 w-full border-2 border-gray-400 px-4 py-3 text-base focus:border-teal-600 focus:outline-none"
          />
        </div>
        {error && (
          <p className="text-sm font-bold text-red-700">{error}</p>
        )}
        {success && (
          <p className="text-sm font-bold text-emerald-700">Password changed successfully</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-700 px-4 py-3 text-base font-bold text-white hover:bg-teal-800 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
