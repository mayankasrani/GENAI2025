import React from 'react';
import { useUser } from '../context/UserContext';

const UserProfile = () => {
  const { userStats } = useUser();

  if (!userStats) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <h2>Your Financial Profile</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <h3>Financial Literacy</h3>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{width: `${userStats.financialLiteracy}%`}}
            />
          </div>
        </div>
        {/* Add other stats similarly */}
      </div>
    </div>
  );
};

export default UserProfile;