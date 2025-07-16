import React, { useState } from 'react';
import axios from 'axios';

type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  [key: string]: unknown;
};

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [totalLoaded, setTotalLoaded] = useState<number>(0);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    setUsers([]);
    setTotalLoaded(0);

    try {
      const response = await axios.get('http://localhost:3000/test', {
        responseType: 'text'
      });

      const lines = response.data.split('\n').filter((line: string) => line.trim());
      const allUsers: User[] = [];

      for (const line of lines) {
        try {
          const usersChunk = JSON.parse(line);
          allUsers.push(...usersChunk);
          setTotalLoaded(allUsers.length);
        } catch (parseError) {
          console.error('Error parsing chunk:', parseError);
        }
      }

      setUsers(allUsers);
      console.log(`Total users loaded: ${allUsers.length}`);
    } catch (err) {
      setError(`Failed to fetch users: ${(err as Error).message}`);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
            <div className="text-gray-200">
              <p className="text-lg font-medium">Loading users...</p>
              <p className="text-sm text-gray-400">Loaded: {totalLoaded} users</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-100">User Database Test</h2>
            <p className="text-gray-400 mt-1">Testing large dataset streaming</p>
          </div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="bg-slate-700 hover:bg-slate-600 text-gray-100 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Load Users
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-900/50 border border-red-700 rounded-lg p-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="text-gray-300 text-sm">
          Total users loaded: <span className="font-bold text-slate-300">{users.length}</span>
        </div>
      </div>

      {users.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Users ({users.length} total)
          </h3>
          
          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {users.slice(0, 50).map((user) => (
              <div
                key={user.id}
                className="bg-gray-700 border border-gray-600 rounded-lg p-3 hover:bg-gray-650 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-100">
                      👤 {user.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      📧 {user.email}
                    </div>
                    {user.phone && (
                      <div className="text-sm text-gray-400">
                        📞 {user.phone}
                      </div>
                    )}
                    {user.company && (
                      <div className="text-sm text-gray-400">
                        🏢 {user.company}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {user.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {users.length > 50 && (
            <div className="mt-4 p-3 bg-gray-700 border border-gray-600 rounded-lg text-center">
              <p className="text-gray-300 text-sm">
                Showing first 50 users of {users.length} total
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserList;
