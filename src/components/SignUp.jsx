// SignUpForm.js

import React, { useState, useEffect } from "react"
import axios from "axios"
import { useHotkeys } from "react-hotkeys-hook"
import toast from "react-hot-toast"

const SignUp = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [salary, setSalary] = useState("")
  const [age, setAge] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [departmentId, setDepartmentId] = useState("")
  const [totalWorkingDays, setTotalWorkingDays] = useState("")
  const [totalWorkingHours, setTotalWorkingHours] = useState("")
  const [salaryPerHour, setSalaryPerHour] = useState("")

  const [departmentSuggestions, setDepartmentSuggestions] = useState([])
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false)

  const handleDepartmentChange = async (value) => {
    try {
      setIsFetchingSuggestions(true)
      if (value !== "") {
        const response = await axios.get("http://localhost:1111/departments", {
          params: { department: value },
        })
        setDepartmentSuggestions(response.data)
      }
    } catch (error) {
      console.error("Error fetching department suggestions:", error)
    } finally {
      setIsFetchingSuggestions(false)
    }
  }

  const handleDepartmentSelect = (selectedDepartment) => {
    setDepartmentId(selectedDepartment.id)
    console.log(selectedDepartment.id)
    setDepartmentSuggestions([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (password != confirmPassword) {
        return toast(
          "the password should be the same as your confirmed password.."
        )
      }
      const response = await axios.post("http://localhost:1111/employees", {
        name,
        email,
        password,
        salary,
        age,
        isadmin: isAdmin,
        department_id: departmentId,
        total_working_days: totalWorkingDays,
        total_working_hours: totalWorkingHours,
        salary_per_hour: salaryPerHour,
      })

      toast.success("Sign-up successful!")
      localStorage.setItem("employee_id", response.data.Employee.id)
      localStorage.setItem("token", response.data.token)
      console.log("Employee created:", response.data)

      // Reset the form after successful submission
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setSalary("")
      setAge("")
      setIsAdmin(false)
      setDepartmentId("")
      setTotalWorkingDays("")
      setTotalWorkingHours("")
      setSalaryPerHour("")
    } catch (error) {
      toast.error("Error signing up. Please try again.")
      console.error("Error creating employee:", error)
    }
  }

  //   // Fetch department suggestions on department input change
  //   useEffect(() => {
  //     if (departmentId === "") {
  //       handleDepartmentChange("")
  //     }
  //   }, [departmentId])

  // Clear suggestions when department input is empty
  useHotkeys("backspace", () => {
    if (departmentId === "") {
      setDepartmentSuggestions([])
    }
  })

  return (
    <div className="max-w-md mx-auto mt-[75px] h-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            name="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {/* Other input fields */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="salaryPerHour"
          >
            Salary Per Hour
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="salaryPerHour"
            type="number"
            name="salaryPerHour"
            placeholder="Enter salary per hour"
            value={salaryPerHour}
            onChange={(e) => setSalaryPerHour(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="department"
          >
            Department
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="department"
            type="text"
            placeholder="Enter department name"
            onChange={(e) => handleDepartmentChange(e.target.value)}
          />
          {isFetchingSuggestions && (
            <p className="text-sm text-gray-500 mt-1">
              Fetching suggestions...
            </p>
          )}
          {departmentSuggestions.length > 0 && (
            <ul className="mt-2">
              {departmentSuggestions.map((department) => (
                <li
                  key={department.id}
                  className="cursor-pointer text-blue-500 hover:text-blue-700"
                  onClick={() => handleDepartmentSelect(department)}
                >
                  {department.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="salary"
          >
            Salary
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="salary"
            type="number"
            name="salary"
            placeholder="Enter your salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="age"
          >
            Age
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="age"
            type="number"
            name="age"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="isAdmin"
          >
            Is Admin
          </label>
          <input
            className="form-checkbox h-5 w-5 text-blue-600"
            id="isAdmin"
            type="checkbox"
            name="isAdmin"
            checked={isAdmin}
            onChange={() => setIsAdmin(!isAdmin)}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="totalWorkingDays"
          >
            Total Working Days
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="totalWorkingDays"
            type="number"
            name="totalWorkingDays"
            placeholder="Enter total working days"
            value={totalWorkingDays}
            onChange={(e) => setTotalWorkingDays(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="totalWorkingHours"
          >
            Total Working Hours
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="totalWorkingHours"
            type="number"
            name="totalWorkingHours"
            placeholder="Enter total working hours"
            value={totalWorkingHours}
            onChange={(e) => setTotalWorkingHours(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          create
        </button>
      </form>
    </div>
  )
}

export default SignUp
