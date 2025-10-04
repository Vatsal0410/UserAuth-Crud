import type { User } from "../types/user";
import UserActions from "./UserActions";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const UserTable = ({ users, onEdit, onDelete }: UserTableProps) => {
  if (users.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-sm border border-white/60 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No users yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first user to the system</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-white/60 overflow-hidden">
      
      <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-blue-50/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              User Management
            </h2>
            <p className="text-gray-600 mt-1 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              {users.length} users in the system
            </p>
          </div>
        </div>
      </div>
      
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50/80 to-gray-100/50 border-b border-gray-200">
              <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                User Information
              </th>
              <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Contact Details
              </th>
              <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Department
              </th>
              <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100/60">
            {users.map((user, index) => (
              <tr 
                key={user.id} 
                className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/20 transition-all duration-200 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-base group-hover:scale-105 transition-transform duration-200 shadow-md">
                      {user.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-medium">{user.email}</div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200/60 shadow-sm">
                    {user.department}
                  </span>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm font-medium">
                  <UserActions
                    user={user}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;