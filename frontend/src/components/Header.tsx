import React from 'react';
import WebSocketStatus from './WebSocketStatus';

const Header: React.FC = () => (
  <div className="w-full max-w-7xl mb-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
          Financial Transaction Dashboard
        </h1>
        <p className="max-w-5xl text-xs md:text-base text-gray-400 mt-2">
          Real-time financial transactions with centralized data management
        </p>
      </div>
      {/* WebSocket Status - Desktop */}
      <div className="hidden md:block">
        <WebSocketStatus showDetails={true} className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border" />
      </div>
    </div>
    {/* WebSocket Status - Mobile */}
    <div className="md:hidden mt-4 flex justify-center">
      <WebSocketStatus showDetails={false} className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border" />
    </div>
  </div>
);

export default Header; 