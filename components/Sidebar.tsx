import React from "react";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-blue-900 text-white flex flex-col p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">VeriFundPH</h1>
        <p className="text-xs text-blue-200">Admin Portal</p>
      </div>

      <nav className="flex flex-col gap-2">
        <button className="bg-blue-800 px-4 py-2 rounded-lg text-left">
          Dashboard
        </button>
        <button className="px-4 py-2 text-left hover:bg-blue-800 rounded-lg">
          Mga Benepisyaryo
        </button>
        <button className="px-4 py-2 text-left hover:bg-blue-800 rounded-lg">
          Distributions
        </button>
        <button className="px-4 py-2 text-left hover:bg-blue-800 rounded-lg">
          Audit Log
        </button>
      </nav>

      <div className="mt-auto bg-blue-800 p-3 rounded-xl text-sm">
        <p className="font-semibold">Quezon City</p>
        <p className="text-xs text-blue-200">District II Head</p>
      </div>
    </div>
  );
};

export default Sidebar;
