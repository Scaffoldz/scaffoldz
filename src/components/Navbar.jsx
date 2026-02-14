function Navbar() {
  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-700">
        Dashboard
      </h1>

      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Grace</span>
        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
      </div>
    </div>
  );
}

export default Navbar;
