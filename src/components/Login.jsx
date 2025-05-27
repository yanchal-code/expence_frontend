import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import Swal from "sweetalert2";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:3300/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", JSON.stringify(result.token));
        localStorage.setItem("welcomeName", result.user.name);
        Swal.fire("Success", "Login Successful!", "success").then(() => {
          navigate("/dashboard");
        });
      } else {
        Swal.fire("Error", result.message || "Login failed!", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong! " + error.message, "error");
    }
  };

  return (
    <>
    <div className="login-container" style={{marginTop: "-2px"}}>
      <div className="login-box">
      <div className="login-left">
  <h1>Welcome to Expense Manager</h1>
  <p>Track your expenses, analyze your spending, and manage your finances effortlessly.</p>
</div>

        <div className="login-right">
          <h3>User Login</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
            
              <div className="input-group">
                <span className="input-group-text"><MdEmail /></span>
                <input type="email" className="form-control" placeholder="Enter your email" {...register("email")} />
              </div>
              <p className="text-danger">{errors.email?.message}</p>
            </div>
            <div className="form-group">
             
              <div className="input-group">
                <span className="input-group-text"><RiLockPasswordFill /></span>
                <input type="password" className="form-control" placeholder="Enter your password" {...register("password")} />
              </div>
              <p className="text-danger">{errors.password?.message}</p>
            </div>
            <div className="form-options">
              <label><input type="checkbox" /> Remember</label>
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
          <p>Don't have an account? <Link to="/signup">Signup</Link></p>
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;
