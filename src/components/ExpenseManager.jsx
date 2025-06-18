import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

const schema = yup.object().shape({
  category: yup.string().required("Category is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount is required"),
  date: yup.string().required("Date is required"),
});

const ExpenseManager = () => {
  const [welcomeName, setWelcomeName] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchExpenses = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await fetch(
        "https://expence-backend-1-nbtx.onrender.com/getData",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const res = await response.json();
      setExpenses(res.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    setWelcomeName(localStorage.getItem("welcomeName") || "Guest");
  }, [reload]);

  const openAddExpenseModal = () => {
    setIsEditing(false);
    setEditId(null);
    reset(); // Clear the form when adding a new expense
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const url = isEditing
        ? `https://expence-backend-1-nbtx.onrender.com/putData/${editId}`
        : "https://expence-backend-1-nbtx.onrender.com/addData";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setReload(!reload);
        setShowModal(false);
        setIsEditing(false);
        reset();
      }
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const deleteExpense = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = JSON.parse(localStorage.getItem("token"));
          await fetch(
            `https://expence-backend-1-nbtx.onrender.com/delData/${id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setReload(!reload);
        } catch (error) {
          console.error("Error deleting expense:", error);
        }
      }
    });
  };

  const editExpense = (expense) => {
    setIsEditing(true);
    setEditId(expense._id || expense.id);
    setShowModal(true);
    setValue("category", expense.category);
    setValue("amount", expense.amount);
    setValue("date", expense.date.split("T")[0]);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/" className="btn btn-secondary">
          <IoIosArrowBack /> Back
        </Link>
        <h5>Welcome {welcomeName} 👋</h5>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <div className="row mb-3">
          <div className="col-sm-12">
            <input
              type="text"
              placeholder="Search..."
              className="form-control"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-primary" onClick={openAddExpenseModal}>
          Add Expense
        </button>
      </div>

      <DataTable
        columns={[
          {
            name: "S.No.",
            selector: (row, index) => index + 1,
            sortable: true,
          },
          { name: "Category", selector: (row) => row.category, sortable: true },
          { name: "Amount", selector: (row) => row.amount, sortable: true },
          {
            name: "Date",
            selector: (row) => new Date(row.date).toLocaleDateString(),
            sortable: true,
          },
          {
            name: "Actions",
            cell: (row) => (
              <>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => editExpense(row)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteExpense(row._id || row.id)}
                >
                  Delete
                </button>
              </>
            ),
          },
        ]}
        data={expenses.filter((expense) =>
          expense.category.toLowerCase().includes(searchText.toLowerCase())
        )}
        pagination
        highlightOnHover
        customStyles={{
          headRow: {
            style: {
              backgroundColor: "#007bff", // Blue background
              color: "white", // White text
              fontWeight: "bold",
              fontSize: "16px", // Bigger text
              height: "40px", // Increased height
              paddingTop: "10px", // Adds space inside
            },
          },
          table: {
            style: {
              marginTop: "20px", // Adds space above the table
            },
          },
        }}
      />

      {/* Right-side Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-end">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{isEditing ? "Edit Expense" : "Add Expense"}</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label>Category</label>
                    <select className="form-select" {...register("category")}>
                      <option value="">Select Category</option>
                      <option value="Food">Food</option>
                      <option value="Travel">Travel</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Education">Education</option>
                      <option value="College Fees">College Fees</option>
                      <option value="Groceries">Groceries</option>
                    </select>
                    <small className="text-danger">
                      {errors.category?.message}
                    </small>
                  </div>

                  <div className="mb-3">
                    <label>Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      {...register("amount")}
                    />
                    <small className="text-danger">
                      {errors.amount?.message}
                    </small>
                  </div>

                  <div className="mb-3">
                    <label>Date</label>
                    <input
                      type="date"
                      className="form-control"
                      {...register("date")}
                    />
                    <small className="text-danger">
                      {errors.date?.message}
                    </small>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    {isEditing ? "Save Changes" : "Add Expense"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManager;
