import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect/dist/core";

function Welcome() {
  const token = localStorage.getItem("token");
  const typewriterRef = useRef(null);

  useEffect(() => {
    if (typewriterRef.current) {
      const typewriter = new Typewriter(typewriterRef.current, {
        strings: ["Welcome To", "Expense Manager"],
        autoStart: true,
        loop: true,
        delay: 75,
        cursor: "|",
      });

      typewriter.start(); // Ensuring the typewriter effect runs
    }
  }, []);

  return (
    <>
      <div className="welcome-container" style={{ marginTop: "-2px" }}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12 text-center" id="welcomeScreen">
              <h2 ref={typewriterRef}></h2>
              <p className="sub-heading">Manage • Visualize • Analyze</p>

              {token ? (
                <>
                  <p className="welcome-text">
                    Welcome back 👋, Seems you are already logged in. Click below to access the dashboard.
                  </p>
                  <Link to="/dashboard">
                    <button className="btn btn-success shadow">Continue</button>
                  </Link>
                </>
              ) : (
                <>
                  <p className="welcome-text">Login or signup to continue.</p>
                  <Link to="/login">
                    <button className="btn btn-primary shadow">Login</button>
                  </Link>
                  &nbsp;<span className="separator">|</span>&nbsp;
                  <Link to="/signup">
                    <button className="btn btn-danger shadow">Signup</button>
                  </Link>
                </>
              )}
            </div>

            {/* Features Section */}
            <div className="row">
              <div className="col-sm-12 text-center py-5">
                <h4 className="features-heading">Features of Expense Manager</h4>
              </div>
            </div>

            {/* Expense Feature Cards */}
            <div className="row justify-content-center me-2">
              <div className="col-md-3">
                <div className="card shadow feature-card">
                  <div className="card-body text-center">
                    <h5 className="card-title">Track Expenses</h5>
                    <p className="card-text">Easily log daily expenses and keep track of your spending habits.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow feature-card">
                  <div className="card-body text-center">
                    <h5 className="card-title">Visual Reports</h5>
                    <p className="card-text">View insightful charts and graphs to analyze your financial trends.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow feature-card">
                  <div className="card-body text-center">
                    <h5 className="card-title">Set Budgets</h5>
                    <p className="card-text">Create and manage budgets to control your spending effectively.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow feature-card">
                  <div className="card-body text-center">
                    <h5 className="card-title">Secure Storage</h5>
                    <p className="card-text">Your financial data is encrypted and securely stored for privacy.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS Styling */}
      <style>
        {`
          /* Remove unwanted space */
          body, html {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }

          .welcome-container {
            background-image: url('bg1.jpg'); /* Replace with a valid image URL */
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            min-height: 100vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6);
            padding: 0; /* Ensure no extra padding */
          }

          /* Remove any extra spacing */
          h2, .sub-heading, .welcome-text {
            margin: 0;
            padding: 5px 0;
          }

          .welcome-container h2 {
            font-size: 2.5rem;
            font-weight: bold;
          }

          .sub-heading {
            font-size: 1.2rem;
            color: #ffcc00;
          }

          .welcome-text {
            font-size: 1.1rem;
            font-weight: 500;
          }

          .separator {
            color: #cdb6b6;
          }

          .features-heading {
            font-size: 1.5rem;
            font-weight: bold;
            color: white;
          }

          .btn {
            font-size: 1.1rem;
            padding: 10px 20px;
          }

          /* Feature Cards */
          .feature-card {
            background-color: white;
            border-radius: 10px;
            margin-bottom: 20px;
            transition: transform 0.3s ease-in-out;
          }

          .feature-card:hover {
            transform: scale(1.05);
          }

          .feature-card .card-title {
            font-size: 1.2rem;
            font-weight: bold;
            color: #0b3d4e;
          }

          .feature-card .card-text {
            font-size: 1rem;
            color: #555;
          }
        `}
      </style>
    </>
  );
}

export default Welcome;
