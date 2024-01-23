import React, { useState } from "react"
import axios from "axios"

const NewMeeting = () => {
  const [formData, setFormData] = useState({
    name: "",
    link: "",
    description: "",
    from: "",
    to: "",
    department_id: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        "http://localhost:1111/meetings",
        formData,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      )

      console.log("Meeting created successfully:", response.data)
      // Additional actions or redirect can be added here
    } catch (error) {
      console.error("Error creating meeting:", error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Create New Meeting</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Link
          </label>
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="datetime-local"
            name="from"
            value={formData.from}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="datetime-local"
            name="to"
            value={formData.to}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department ID
          </label>
          <input
            type="text"
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 mb-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Meeting
        </button>
      </form>
    </div>
  )
}

export default NewMeeting
