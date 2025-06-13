import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import Swal from "sweetalert2";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

function Signup() {
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
      const response = await fetch("http://localhost:3300/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire("Success", "Account created successfully!", "success").then(
          () => {
            navigate("/login");
          }
        );
      } else {
        Swal.fire("Error", result.message || "Signup failed!", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong! " + error.message, "error");
    }
  };

  return (
    <>
      <div className="signup-container" style={{ marginTop: "-2px" }}>
        <div
          className="signup-box"
          style={{ maxWidth: "600px", padding: "3rem" }}
        >
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-6">
                <div className="input-group mb-4">
                  <span className="input-group-text">
                    <FaRegUser />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="User Name"
                    {...register("name")}
                  />
                </div>
                <p className="error-text">{errors.name?.message}</p>
              </div>
              <div className="col-md-6">
                <div className="input-group mb-4">
                  <span className="input-group-text">
                    <MdOutlineEmail />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    {...register("email")}
                  />
                </div>
                <p className="error-text">{errors.email?.message}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="input-group mb-4">
                  <span className="input-group-text">
                    <RiLockPasswordLine />
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    {...register("password")}
                  />
                </div>
                <p className="error-text">{errors.password?.message}</p>
              </div>
              <div className="col-md-6">
                <div className="input-group mb-4">
                  <span className="input-group-text">
                    <RiLockPasswordLine />
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    {...register("confirmPassword")}
                  />
                </div>
                <p className="error-text">{errors.confirmPassword?.message}</p>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="signup-btn btn btn-primary w-100"
              >
                Sign Up
              </button>
            </div>
          </form>
          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;
