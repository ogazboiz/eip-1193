import { useState } from 'react';

import './App.css';
import Eip1193 from './components/Eip1193';

function App() {
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Mini Interaction with EIP-1193
        </h1>
        <Eip1193 />
      </div>

      {/* Footer */}
      <footer className="mt-8 text-gray-500 text-sm">
        Made by <span className="font-semibold">Ogazboiz</span>
      </footer>
    </div>
  );
}

export default App;
