import React from 'react';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800">
        <div className="p-4 text-lg font-bold">Your Logo</div>
        <nav className="mt-6 space-y-2">
          <a href="#" className="block px-4 py-2 hover:bg-gray-700 rounded">Dashboard</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-700 rounded">User Profiles</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-700 rounded">Transaktionen</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-700 rounded">Einnahmen</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-700 rounded">Ausgaben</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-700 rounded">Reports</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-700 rounded">Settings</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-700 rounded">Support</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-700 rounded">Log out</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl">Hello, Drax</h1>
          <div className="flex items-center space-x-4">
            <button className="bg-gray-700 p-2 rounded">☀️</button>
            <button className="bg-gray-700 p-2 rounded">🔔</button>
            <button className="bg-gray-700 p-2 rounded">🔍</button>
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-lg">Einnahmen</h2>
            <p className="text-2xl font-bold">6.158,04 €</p>
            <p className="text-green-400">⬆️ 11.94%</p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-lg">Ausgaben</h2>
            <p className="text-2xl font-bold">678,72 €</p>
            <p className="text-red-400">⬇️ 19.91%</p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-lg">Saldo</h2>
            <p className="text-2xl font-bold">5.479,32 €</p>
            <p className="text-green-400">⬆️ 21.17%</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-gray-800 p-6 rounded mb-6">
          <h2 className="text-lg mb-4">Einnahmen</h2>
          <div className="h-48 bg-gray-700 rounded">[Chart Placeholder]</div>
        </div>

        {/* Latest Transactions */}
        <div className="bg-gray-800 p-6 rounded">
          <h2 className="text-lg mb-4">Letzte Transaktionen</h2>
          <ul>
            <li className="flex justify-between mb-2">
              <span>Metro Einkauf</span>
              <span className="text-red-400">-678,72 €</span>
            </li>
            <li className="flex justify-between mb-2">
              <span>Standmiete</span>
              <span className="text-red-400">-100,00 €</span>
            </li>
            <li className="flex justify-between">
              <span>Einnahmen Messe</span>
              <span className="text-green-400">+6.158,04 €</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
