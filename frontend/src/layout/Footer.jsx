import React from 'react';
import { Activity } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Activity className="h-8 w-8 text-secondary" />
            <span className="text-2xl font-bold">EVE Health</span>
          </div>
          <div className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} EVE Healthcare Diagnostic Booking System. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;