import { Routes,BrowserRouter,Route } from 'react-router-dom'
import './App.css'
import Welcome from './components/Welcome'
import Login from './components/Login'
import Signup from './components/Signup'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import ExpenseManager from './components/ExpenseManager'
import PrivateRoute from "./components/PrivateRoute";


function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
            } />

          <Route path="/manage-expenses" element={
            <PrivateRoute>
              <ExpenseManager />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
