import React from 'react';
import { getStatusDisplay } from '../../Booking History/utils';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusDisplay = getStatusDisplay(status);
  
  return (
    <div className="flex items-center space-x-1">
      <span className={`w-3 h-3 rounded-full ${statusDisplay.color}`}></span>
      <span className="text-sm text-gray-500">{statusDisplay.text}</span>
      {statusDisplay.icon}
    </div>
  );
};

export default StatusBadge;