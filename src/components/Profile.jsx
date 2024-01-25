import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import moment from "moment"

const PerformanceModal = ({ onClose, employeeId }) => {
  const [formData, setFormData] = useState({
    status: "",
    points: "",
    employee_id: employeeId,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // API call to create performance record
      const performanceResponse = await axios.post(
        "http://localhost:1111/performances",
        {
          status: formData.status,
          points: formData.points,
          employee_id: formData.employee_id,
        }
      )

      const performanceId =
        performanceResponse.data.id || performanceResponse.data.dataValues.id

      // API call to update employee with performance_id
      await axios.put(
        `http://localhost:1111/users/property/${formData.employee_id}`,
        {
          propertyValue: performanceId,
        },
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
          params: {
            propertyName: "performance_id",
          },
        }
      )

      // Close modal and show success message
      onClose()
      toast.success("Performance record created successfully!")
    } catch (error) {
      console.error("Error creating performance record:", error)
      toast.error("Error creating performance record. Please try again.")
    }
  }

  return (
    <div className={`fixed z-50 inset-0 overflow-y-auto`}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <button
            className="bg-blue-500 absolute top-0 right-0 m-4 text-white font-bold px-3 py-1 rounded"
            onClick={() => {
              onClose()
            }}
          >
            Close
          </button>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Your form content */}
            <form onSubmit={handleSubmit}>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="status"
              >
                Status
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="status"
                type="text"
                name="status"
                placeholder="Enter status"
                value={formData.status}
                onChange={handleChange}
              />

              <label
                className="block text-gray-700 text-sm font-bold mb-2 mt-4"
                htmlFor="points"
              >
                Points
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="points"
                type="number"
                name="points"
                placeholder="Enter points"
                value={formData.points}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

const Profile = () => {
  const [employee, setUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false)

  const [formData, setFormData] = useState({
    company: "",
    from: "",
    to: "",
    employee_id: localStorage.getItem("employee_id"), // You may initialize it based on your requirements
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const start_date = moment(formData.from).format(
        "YYYY-MM-DDTHH:mm:ss.SSSZ"
      )
      const end_date = moment(formData.to).format("YYYY-MM-DDTHH:mm:ss.SSSZ")

      const response = await axios.post(
        "http://localhost:1111/experiences",
        {
          company: formData.company,
          from: start_date,
          to: end_date,
          employee_id: formData.employee_id,
        },
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      )

      console.log(response.data) // Handle the response as needed

      // Reset the form after successful submission
      setFormData({
        company: "",
        from: "",
        to: "",
        employee_id: "",
      })
      toast.success("done!")
    } catch (error) {
      toast("please try again!")
      console.error("Error submitting experience:", error.message, error)
      // Handle errors as needed
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const employee_id = localStorage.getItem("employee_id")

        const response = await axios.get(
          `http://localhost:1111/users/${employee_id}`,
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        )

        setUser(response.data)
        toast.success("fetched the employee...")
      } catch (error) {
        toast("could not fetch the employee")
        console.error("Error fetching employee details:", error.message, error)
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="container mx-auto my-60">
      {isPerformanceModalOpen && (
        <PerformanceModal
          onClose={() => setIsPerformanceModalOpen(false)}
          employeeId={localStorage.getItem("employee_id")}
        />
      )}
      {isOpen && (
        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>

            {/* Modal */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <button
                className="bg-blue-500 relative top-5 ml-[220px] hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mt-4"
                onClick={() => {
                  setIsOpen(false)
                }}
              >
                exit
              </button>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Your form content */}
                <form onSubmit={handleSubmit}>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="company"
                  >
                    Company
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="company"
                    type="text"
                    name="company"
                    placeholder="Enter company name"
                    value={formData.company}
                    onChange={handleChange}
                  />

                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 mt-4"
                    htmlFor="from"
                  >
                    From
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="from"
                    type="date"
                    name="from"
                    value={formData.from}
                    onChange={handleChange}
                  />

                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 mt-4"
                    htmlFor="to"
                  >
                    To
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="to"
                    type="date"
                    name="to"
                    value={formData.to}
                    onChange={handleChange}
                  />

                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="bg-white relative shadow rounded-lg w-5/6 md:w-5/6 lg:w-4/6 xl:w-3/6 mx-auto">
          <div className="flex justify-center">
            <img
              src="https://avatars0.githubusercontent.com/u/35900628?v=4"
              alt=""
              className="rounded-full mx-auto absolute -top-20 w-32 h-32 shadow-md border-4 border-white transition duration-200 transform hover:scale-110"
            />
          </div>

          <div className="mt-16">
            <h1 className="font-bold text-center text-3xl text-gray-900">
              Pantazi Software
            </h1>
            <p className="text-center text-sm text-gray-400 font-medium">
              UI Components Factory
            </p>

            <div className="my-5 px-6">
              <a
                href="#"
                className="text-gray-200 block rounded-lg text-center font-medium leading-6 px-6 py-3 bg-gray-900 hover:bg-black hover:text-white"
              >
                Add a review <span className="font-bold">@pantazisoft</span>
              </a>
            </div>

            <div className="flex justify-between items-center my-5 px-6">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => {
                  setIsOpen(true)
                  console.log(isOpen)
                }}
              >
                +experience
              </button>
              <button
                className="text-blue-500 hover:text-gray-900 hover:bg-gray-100 rounded transition duration-150 ease-in font-medium text-sm text-center w-full py-3"
                onClick={() => {
                  setIsPerformanceModalOpen(true)
                  console.log(isPerformanceModalOpen)
                }}
              >
                +performance
              </button>
              <a
                href=""
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition duration-150 ease-in font-medium text-sm text-center w-full py-3"
              >
                Instagram
              </a>
              <a
                href=""
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition duration-150 ease-in font-medium text-sm text-center w-full py-3"
              >
                Email
              </a>
            </div>

            <div className="w-full">
              <h3 className="font-medium text-gray-900 text-left px-6">
                Recent activities
              </h3>
              <div className="mt-5 w-full flex flex-col items-center overflow-hidden text-sm">
                <a
                  href="#"
                  className="w-full border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150"
                >
                  <img
                    src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                    alt=""
                    className="rounded-full h-6 shadow-md inline-block mr-2"
                  />
                  Updated his status
                  <span className="text-gray-500 text-xs">24 min ago</span>
                </a>

                <a
                  href="#"
                  className="w-full border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150"
                >
                  <img
                    src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                    alt=""
                    className="rounded-full h-6 shadow-md inline-block mr-2"
                  />
                  Added new profile picture
                  <span className="text-gray-500 text-xs">42 min ago</span>
                </a>

                <a
                  href="#"
                  className="w-full border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150"
                >
                  <img
                    src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                    alt=""
                    className="rounded-full h-6 shadow-md inline-block mr-2"
                  />
                  Posted new article in{" "}
                  <span className="font-bold">#Web Dev</span>
                  <span className="text-gray-500 text-xs">49 min ago</span>
                </a>

                <a
                  href="#"
                  className="w-full border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150"
                >
                  <img
                    src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                    alt=""
                    className="rounded-full h-6 shadow-md inline-block mr-2"
                  />
                  Edited website settings
                  <span className="text-gray-500 text-xs">1 day ago</span>
                </a>

                <a
                  href="#"
                  className="w-full border-t border-gray-100 text-gray-600 py-4 pl-6 pr-3 w-full block hover:bg-gray-100 transition duration-150 overflow-hidden"
                >
                  <img
                    src="https://avatars0.githubusercontent.com/u/35900628?v=4"
                    alt=""
                    className="rounded-full h-6 shadow-md inline-block mr-2"
                  />
                  Added new rank
                  <span className="text-gray-500 text-xs">5 days ago</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
