import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import moment from "moment"
import { toast } from "react-hot-toast"
import JoditEditor from "jodit-react"

const NewTicket = () => {
  const editor = useRef(null)
  const [steps, setSteps] = useState([])
  const [employees, setEmployees] = useState([])
  const [videoFile, setVideoFile] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    body: "",
    employee_id: "",
    deadline: moment().add(2, "days").format("YYYY-MM-DD"),
    status: "open",
  })

  useEffect(() => {
    // Fetch list of employees
    const fetchEmployees = async () => {
      try {
        const authToken = localStorage.getItem("token")
        const response = await axios.get("http://localhost:1111/employees", {
          headers: {
            "x-auth-token": authToken,
          },
        })

        setEmployees(response.data)
      } catch (error) {
        toast.error("Error fetching employees: " + error.message)
        console.error("Error fetching employees:", error)
      }
    }

    fetchEmployees()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleStepsChange = (e) => {
    const { value } = e.target
    setSteps((prevSteps) => [...prevSteps, value])
  }

  const handleRemove = (indexToRemove) => {
    setSteps((prevSteps) =>
      prevSteps.filter((_, index) => index !== indexToRemove)
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      formData.employee_id = parseInt(formData.employee_id)

      const videoFile = document.getElementById("user_avatar").files[0]

      const formDataWithVideo = new FormData()
      formDataWithVideo.append("name", formData.name)
      formDataWithVideo.append("body", formData.body)
      formDataWithVideo.append("employee_id", formData.employee_id)
      formDataWithVideo.append("deadline", formData.deadline)
      formDataWithVideo.append("status", formData.status)
      formDataWithVideo.append("video", videoFile) // Append the video file

      // Append steps as JSON string
      formDataWithVideo.append("steps", JSON.stringify(steps))

      const response = await axios.post(
        "http://localhost:1111/tickets",
        formDataWithVideo,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
            "Content-Type": "multipart/form-data", // Important for file upload
          },
        }
      )

      console.log("Ticket created successfully:", response.data)
      toast.success("Ticket created successfully!")
      // Additional actions or redirect can be added here
    } catch (error) {
      toast.error("Error creating ticket. Please try again.")
      console.error("Error creating ticket:", error)
    }
  }

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0])
  }

  return (
    <div className="max-w-2xl  mt-[75px] mx-auto w-[1000px]">
      <h2 className="text-2xl font-bold mb-4">Create New Ticket</h2>
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
        <div></div>

        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          for="user_avatar"
        >
          Video Tutorial
        </label>
        <input
          class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 h-[30px]"
          aria-describedby="user_avatar_help"
          id="user_avatar"
          type="file"
          accept="video/*"
          onChange={handleFileChange}
        />
        <div
          class="mt-1 text-sm text-gray-500 dark:text-gray-300"
          id="user_avatar_help"
        >
          A video tutorial is useful to visually represent the task
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Steps
          </label>
          {steps.map((step, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                value={step}
                onChange={(e) => {
                  const newSteps = [...steps]
                  newSteps[index] = e.target.value
                  setSteps(newSteps)
                }}
                className="mt-3 p-2 border rounded-md w-full"
              />
              <button
                type="button"
                className="px-3 py-1 font-medium bg-red-600 mt-2 rounded-lg hover:bg-red-800"
                onClick={() => handleRemove(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <input
            type="text"
            value=""
            onChange={handleStepsChange}
            className="mt-3 p-2 border rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Body
          </label>
          <JoditEditor
            ref={editor}
            value={formData.body}
            tabIndex={1}
            onBlur={(newContent) => {
              setFormData({ ...formData, body: newContent })
            }}
            onChange={(newContent) => {}}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Assign to Employee
          </label>
          <select
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md w-full"
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
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md w-full"
          >
            <option value="open">Open</option>
            <option value="in-progress">In-Progress</option>
            <option value="open">Closed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 mb-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Ticket
        </button>
      </form>
    </div>
  )
}

export default NewTicket
