import { useState } from "react";
import type { User } from "../store/userStore";

interface UserActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const UserActions = ({ user, onEdit, onDelete }: UserActionsProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await onDelete(user.id);
      setShowDeleteConfirm(false);
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Edit Button */}
      <button
        onClick={() => onEdit(user)}
        className="group flex items-center space-x-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-all duration-200 border border-blue-200 hover:border-blue-300"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span className="text-sm font-medium">Edit</span>
      </button>

      {/* Delete Button & Confirmation */}
      {showDeleteConfirm ? (
        <div className="flex flex-col space-y-2 bg-red-50 p-3 rounded-lg border border-red-200">
          {error && (
            <div className="p-2 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-xs text-red-700 font-medium">{error}</p>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className={`flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                deleting 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-red-700 hover:shadow-lg"
              }`}
            >
              {deleting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Confirm</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setError(null);
              }}
              className="flex items-center space-x-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="group flex items-center space-x-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-all duration-200 border border-red-200 hover:border-red-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="text-sm font-medium">Delete</span>
        </button>
      )}
    </div>
  );
};

export default UserActions;