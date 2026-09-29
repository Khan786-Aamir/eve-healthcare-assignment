import React from 'react';

const EmptyState = ({ message = "No data found", icon: Icon }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-500">
      {Icon && <Icon className="w-12 h-12 mb-4 text-gray-400" />}
      <p className="text-lg">{message}</p>
    </div>
  );
};

export default EmptyState;