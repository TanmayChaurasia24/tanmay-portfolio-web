
import React from 'react';

const SolanaModel = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        {/* Main purple sphere */}
        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full animate-pulse shadow-xl"></div>
        
        {/* Smaller blue sphere */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full animate-bounce shadow-lg"></div>
        
        {/* Even smaller green sphere */}
        <div className="absolute -bottom-2 -left-6 w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-pulse shadow-md"></div>
      </div>
    </div>
  );
};

export default SolanaModel;
