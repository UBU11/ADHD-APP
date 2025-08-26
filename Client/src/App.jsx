
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./Components/common/ProtectedRoute";
import Header from "./components/layout/Header";

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen font-sans">
        <Header />
        <main>
          <Routes>
            {/* <Route path="/" element={<Login />} /> */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
