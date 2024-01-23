import React, { useState, useEffect } from "react"
import axios from "axios"

const Tickets = () => {
  const [tickets, setTickets] = useState([])
  const [filter, setFilter] = useState("open") // Default filter is empty
  const [sortingProperty, setSortingProperty] = useState("name") // Default sorting property is 'name'

  // Fetch tickets based on filter and sortingProperty
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1111/tickets/${filter}`,
          {
            params: {
              sortingProperty: sortingProperty,
            },
          }
        )
        setTickets(response.data)
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching tickets:", error)
      }
    }

    fetchTickets()
    fetchTicketCounts()
  }, [filter, sortingProperty])

  // Fetch the number of tickets for each status

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  const handleSortingPropertyChange = (property) => {
    setSortingProperty(property)
  }

  return (
    <div className="container mx-auto  p-6">
      <div className="mb-4">
        <select
          id="filterDropdown"
          className="appearance-none border rounded w-64 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={handleFilterChange}
          value={filter}
        >
          <option value="">-- Select Status --</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="in-progress">In Progress</option>
        </select>
      </div>

      {/* GitHub-style files mapping UI */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <button
              className={`${
                sortingProperty === "name"
                  ? "bg-gray-800 text-white"
                  : "text-gray-700"
              } py-1 px-3 rounded-l focus:outline-none`}
              onClick={() => handleSortingPropertyChange("name")}
            >
              Name
            </button>
            <button
              className={`${
                sortingProperty === "createdAt"
                  ? "bg-gray-800 text-white"
                  : "text-gray-700"
              } py-1 px-3 rounded-r focus:outline-none`}
              onClick={() => handleSortingPropertyChange("createdAt")}
            >
              Created At
            </button>
          </div>
          <button
            className={`${
              sortingProperty === "status"
                ? "bg-gray-800 text-white"
                : "text-gray-700"
            } py-1 px-3 rounded-r focus:outline-none`}
            onClick={() => handleSortingPropertyChange("status")}
          >
            Status
          </button>
        </div>
      </div>

      {/* Ticket List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{ticket.name}</h2>
            <p className="text-gray-600">{ticket.createdAt}</p>
            <p className="text-gray-600">{ticket.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tickets
