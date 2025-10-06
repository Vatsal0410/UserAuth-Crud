import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import type { User, UserFormData } from "../types/user"
import { showError, showSuccess } from "../utils/toast"

interface UserFormProps {
  open: boolean
  user?: User | null
  onClose: () => void
  onSubmit: (user: UserFormData) => Promise<void>
  isEditing?: boolean
}

const UserForm = ({
  open,
  user,
  onClose,
  onSubmit,
  isEditing,
}: UserFormProps) => {
  // Initialize useForm
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UserFormData>({
    defaultValues: {
      name: "",
      email: "",
      department: "",
    },
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // add event listener for escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)

      // if user is updating
      if (isEditing && user) {
        reset({
          name: user.name,
          email: user.email,
          department: user.department,
        })
      }
      // if user is adding
      else {
        reset({
          name: "",
          email: "",
          department: "",
        })
      }
    }

    // clean up the event listener
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, user, isEditing, reset, onClose])

  // add event listener for mouse click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!open) return null

  // handle form submit
  const onFormSubmit = async (data: UserFormData) => {
    setLoading(true)
    try {
      // if user not change and is editing
      if (isEditing && user && !isDirty) {
        showSuccess("No changes detected")
        onClose()
        return
      }

      await onSubmit(data)
      showSuccess(
        isEditing ? "User updated successfully" : "User added successfully"
      )

      // reset form if not editing
      if (!isEditing) {
        reset()
      }
      onClose()
    } catch (err: any) {
      showError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // handle form close
  const handleClose = () => {
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50 bg-gray-900/70 backdrop-blur-md"
      onClick={handleBackdropClick}
    >
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md transform transition-all">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isEditing
                    ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    : "M12 4v16m8-8H4"
                }
              />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          {isEditing ? "Edit User" : "Add User"}
        </h2>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Name must be less than 50 characters",
                },
                pattern: {
                  value: /^[a-zA-Z\s]*$/,
                  message: "Name can only contain letters and spaces",
                },
                validate: {
                  noSpecialChars: (value) =>
                    /^[a-zA-Z\s]+$/.test(value) ||
                    "Name cannot contain numbers or special characters",
                  noMultipleSpaces: (value) =>
                    !/\s{2,}/.test(value) ||
                    "Name cannot have multiple consecutive spaces",
                  trimValidation: (value) =>
                    value.trim() === value ||
                    "Name cannot start or end with spaces",
                },
              }}
              render={({ field, fieldState }) => (
                <div>
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter user's full name"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      fieldState.invalid
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    } ${
                      fieldState.isDirty && !fieldState.invalid
                        ? "border-green-500 bg-green-50"
                        : ""
                    }`}
                  />
                  {fieldState.isDirty && !fieldState.invalid && (
                    <div className="flex items-center mt-1">
                      <svg
                        className="w-4 h-4 text-green-500 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-green-600">
                        Name looks good!
                      </span>
                    </div>
                  )}
                </div>
              )}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email address is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
                maxLength: {
                  value: 100,
                  message: "Email must be less than 100 characters",
                },
                validate: {
                  noSpaces: (value) =>
                    !/\s/.test(value) || "Email cannot contain spaces",
                  validDomain: (value) =>
                    /@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(value) ||
                    "Please enter a valid domain",
                  trimValidation: (value) =>
                    value.trim() === value ||
                    "Email cannot start or end with spaces",
                },
              }}
              render={({ field, fieldState }) => (
                <div>
                  <input
                    {...field}
                    type="email"
                    placeholder="Enter user's email address"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      fieldState.invalid
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    } ${
                      fieldState.isDirty && !fieldState.invalid
                        ? "border-green-500 bg-green-50"
                        : ""
                    }`}
                  />
                  {fieldState.isDirty && !fieldState.invalid && (
                    <div className="flex items-center mt-1">
                      <svg
                        className="w-4 h-4 text-green-500 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-green-600">
                        Valid email format!
                      </span>
                    </div>
                  )}
                </div>
              )}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Department Input */}
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Department
            </label>
            <Controller
              name="department"
              control={control}
              rules={{
                required: "Department is required",
                minLength: {
                  value: 2,
                  message: "Department must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Department must be less than 50 characters",
                },
                pattern: {
                  value: /^[a-zA-Z0-9\s&-]*$/,
                  message:
                    "Department can only contain letters, numbers, spaces, & and -",
                },
                validate: {
                  noSpecialChars: (value) =>
                    /^[a-zA-Z0-9\s&-]+$/.test(value) ||
                    "Department cannot contain special characters except & and -",
                  noMultipleSpaces: (value) =>
                    !/\s{2,}/.test(value) ||
                    "Department cannot have multiple consecutive spaces",
                  trimValidation: (value) =>
                    value.trim() === value ||
                    "Department cannot start or end with spaces",
                  meaningfulName: (value) =>
                    value.length >= 2 || "Department name is too short",
                },
              }}
              render={({ field, fieldState }) => (
                <div>
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter user's department"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      fieldState.invalid
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    } ${
                      fieldState.isDirty && !fieldState.invalid
                        ? "border-green-500 bg-green-50"
                        : ""
                    }`}
                  />
                  {fieldState.isDirty && !fieldState.invalid && (
                    <div className="flex items-center mt-1">
                      <svg
                        className="w-4 h-4 text-green-500 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-green-600">
                        Valid department!
                      </span>
                    </div>
                  )}
                </div>
              )}
            />
            {errors.department && (
              <p className="text-sm text-red-600 mt-1">
                {errors.department.message}
              </p>
            )}
          </div>

          <div className="flex space-x-3">
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (isEditing && !isDirty)}
              className="flex-1 cursor-pointer bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2 border border-blue-600"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isEditing ? "Updating..." : "Creating..."}</span>
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
                      d={isEditing ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"}
                    />
                  </svg>
                  <span>{isEditing ? "Update User" : "Create User"}</span>
                </>
              )}
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 cursor-pointer bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium border border-gray-300"
            >
              Cancel
            </button>
          </div>

          {isEditing && !isDirty && (
            <p className="text-sm text-blue-600 text-center">
              No changes made to the user data
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default UserForm
