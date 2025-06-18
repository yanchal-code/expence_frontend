import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

function Dashboard() {
  const [welcomeName, setWelcomeName] = useState("");
  const [graphData, setGraphData] = useState([]);
  const [summary, setSummary] = useState({});
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await fetch(
        "https://expence-backend-1-nbtx.onrender.com/getDashboardOveriew",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const res = await response.json();

      if (res.success && res.data) {
        setGraphData(res.data.graph_data);
        setSummary(res.data.others);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem("welcomeName");
    if (storedName) {
      setWelcomeName(storedName);
    }
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token"); // Remove token
        navigate("/"); // Redirect to home
        Swal.fire("Logged Out!", "You have been logged out.", "success");
      }
    });
  };

  return (
    <div>
      {/* Header Section */}

      <div className="container mt-4">
        <div className="row">
          {/* Welcome Section */}
          <div className="col-sm-12">
            <h5>Welcome, {welcomeName || "Guest"} 👋</h5>
          </div>
          <div className="col-sm-12">
            <hr />
          </div>

          {/* This Month Overview */}
          <div className="col-sm-6">
            <div className="card shadow">
              <div className="card-header">
                <div
                  style={{
                    borderLeft: "3px solid #787272",
                    paddingLeft: 10,
                    marginTop: 10,
                  }}
                >
                  <h5>Overall Expenses</h5>
                </div>
              </div>
              <div className="card-body text-center">
                {/* <img
                  className="img-fluid w-100"
                  src="https://images.topperlearning.com/topper/tinymce/imagemanager/files/Bar1.png"
                  alt="Expense Chart"
                /> */}
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={graphData}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="expense">
                      {graphData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Overall Summary */}
          <div className="col-sm-6">
            <div className="card shadow">
              <div className="card-header">
                <div
                  style={{
                    borderLeft: "3px solid #787272",
                    paddingLeft: 10,
                    marginTop: 10,
                  }}
                >
                  <h5>Overall Summary</h5>
                </div>
              </div>
              <div className="card-body">
                <table className="table table-bordered table-striped">
                  <tbody>
                    <tr>
                      <td>Total Spent</td>
                      <td>{summary.all_time_spent_overall || 0} Rs.</td>
                    </tr>
                    <tr>
                      <td>Most Spent on</td>
                      <td>{summary.most_spent_category || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>Least Spent on</td>
                      <td>{summary.least_spent_category || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>Spent on Entertainment</td>
                      <td>{summary.spent_on_entertainment || 0} Rs.</td>
                    </tr>
                  </tbody>
                </table>
                <table className="table table-bordered table-striped">
                  <tbody>
                    <tr>
                      <td>
                        Total Spent (
                        {new Date().toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        })}
                        )
                      </td>
                      <td>{summary.current_month_expense || 0} Rs.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card mt-2 shadow">
              <div className="card-body text-center">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/manage-expenses")}
                >
                  View Details / Add Expense
                </button>
                &nbsp;<span style={{ color: "#cdb6b6" }}>|</span>&nbsp;
                <button className="btn btn-danger" onClick={handleLogout}>
                  <i className="bi bi-power"></i> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Space */}
      <br />
      <br />
      <br />
    </div>
  );
}

export default Dashboard;
