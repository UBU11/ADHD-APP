
import Button from "../components/common/Button";

const Login = () => {
  const handleLogin = () => {
    // Redirects to the backend Google OAuth route
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="flex items-center justify-center h-screen -mt-16">
      <div className="text-center bg-white p-12 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          ADHD College Planner
        </h1>
        <p className="text-gray-600 mb-8">
          Log in to take control of your assignments.
        </p>
        <Button onClick={handleLogin}>Login with Google</Button>
      </div>
    </div>
  );
};

export default Login;
