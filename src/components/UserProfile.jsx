import React from 'react';
import { useUser } from '../context/UserContext';

const UserProfile = () => {
  const { userStats } = useUser();

  if (!userStats) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <h2>Your Profile</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <h3>Tasks Completed</h3>
          <div className="stat-value">
            {userStats.tasksCompleted}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;