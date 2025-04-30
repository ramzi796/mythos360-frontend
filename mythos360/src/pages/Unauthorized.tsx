const Unauthorized = () => (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white shadow-md p-6 rounded text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
        <p>You do not have access to this page.</p>
      </div>
    </div>
  );
  
  export default Unauthorized;
  