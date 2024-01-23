import React, { useState, useEffect } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"

const TicketDetails = () => {
  const [ticket, setTicket] = useState(null)
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const { id } = useParams()

  useEffect(() => {
    // Fetch ticket details
    console.log("id is ", id)
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`http://localhost:1111/tickets/${id}`)
        setTicket(response.data)
      } catch (error) {
        console.error("Error fetching ticket details:", error)
      }
    }

    // Fetch list of employees
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:1111/employees", {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        })
        setEmployees(response.data)
      } catch (error) {
        console.error("Error fetching employees:", error)
      }
    }

    fetchTicket()
    fetchEmployees()
  }, [id])

  const handleAssign = async () => {
    try {
      // Call API to assign ticket to selected employee
      await axios.put(
        `http://localhost:1111/tickets/assign/${id}`,
        {
          employee_id: selectedEmployee,
        },
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      )

      // Refresh ticket details after assignment
      const response = await axios.get(`/api/tickets/${id}`)
      setTicket(response.data)

      // Display success message or perform additional actions
      console.log("Ticket assigned successfully!")
    } catch (error) {
      console.error("Error assigning ticket:", error)
    }
  }

  return (
    <div>
      <h2 className="text-2xl mt-[75px] font-bold mb-4">Ticket Details</h2>
      {ticket ? (
        <div>
          <div className="mb-4">
            <strong>Ticket Name:</strong> {ticket.name}
          </div>
          <div className="mb-4">
            <strong>Employee:</strong>{" "}
            {ticket.Employee ? ticket.Employee.name : "Not Assigned"}
          </div>

          <video class="w-[250px] h-[250px] mx-auto" controls>
            <source src={ticket.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to Employee:
            </label>
            <select
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="" disabled>
                Select an employee
              </option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAssign}
          >
            Assign Ticket
          </button>
        </div>
      ) : (
        <p>Loading ticket details...</p>
      )}
    </div>
  )
}

export default TicketDetails
