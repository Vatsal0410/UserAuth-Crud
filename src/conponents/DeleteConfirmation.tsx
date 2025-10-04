import { useEffect } from "react";

interface DeleteConfirmationProps {
  open: boolean;
  user: { id: string; name: string; email: string; department: string } | null;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const DeleteConfirmation = ({
  open,
  user,
  onClose,
  onConfirm,
  loading,
}: DeleteConfirmationProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open || !user) return null;

  return (
    <div 
      className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50 bg-gray-900/70 backdrop-blur-md"
      onClick={handleBackdropClick} 
    >
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md transform transition-all">
        
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Delete User</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="font-semibold text-red-800 text-lg">{user.name}</p>
            <p className="text-sm text-red-600">{user.email}</p>
            <p className="text-xs text-red-500 mt-1">{user.department} Department</p>
          </div>

          <p className="text-sm text-red-600 font-medium">
            ⚠️ This will permanently remove the user from the system.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 cursor-pointer text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2 border border-red-600"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>Delete User</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose} 
            disabled={loading}
            className="flex-1 bg-gray-200 cursor-pointer text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium border border-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;