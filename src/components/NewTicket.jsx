import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import moment from "moment"
import { toast } from "react-hot-toast"
import JoditEditor from "jodit-react"
import { DropdownMenu, Button, TextField } from "@radix-ui/themes"

const NewTicket = () => {
  const editor = useRef(null)
  const [users, setUsers] = useState([])
  const [videoFile, setVideoFile] = useState(null)
  const config = {
    height: 500, // Set your desired default height here
  }
  const [formData, setFormData] = useState({
    name: "",
    body: "",
    user_id: "",
    deadline: moment().add(2, "days").format("YYYY-MM-DD"),
    status: "open",
  })

  useEffect(() => {
    // Fetch list of users
    const fetchUsers = async () => {
      try {
        const authToken = localStorage.getItem("token")
        const response = await axios.get("http://localhost:1111/users", {
          headers: {
            "x-auth-token": authToken,
          },
        })

        setUsers(response.data)
      } catch (error) {
        toast.error("Error fetching users: " + error.message)
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [])

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
      formData.user_id = parseInt(formData.user_id)

      const videoFile = document.getElementById("user_avatar").files[0]

      const formDataWithVideo = new FormData()
      formDataWithVideo.append("name", formData.name)
      formDataWithVideo.append("body", formData.body)
      formDataWithVideo.append("user_id", formData.user_id)
      formDataWithVideo.append("deadline", formData.deadline)
      formDataWithVideo.append("status", formData.status)
      formDataWithVideo.append("video", videoFile) // Append the video file

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
    <div className="max-w-4xl my-10 mt-[40px] mx-auto w-[1000px]">
      <h2 className="text-2xl font-bold mb-4">Create New Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <TextField.Input
            size="3"
            placeholder="Search the docs…"
            onChange={handleChange}
          />
        </div>

        <input
          type="file"
          onChange={() => handleFileChange(e)}
          name="file-input"
          id="file-input"
          className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600
    file:bg-gray-50 file:border-0
    file:bg-gray-100 file:me-4
    file:py-3 file:px-4
    dark:file:bg-gray-700 dark:file:text-gray-400"
        />
        <div>
          <JoditEditor
            ref={editor}
            config={config}
            value={formData.body}
            tabIndex={1}
            onBlur={(newContent) => {
              setFormData({ ...formData, body: newContent })
            }}
            onChange={(newContent) => {}}
            className="h-[100px]"
          />
        </div>

        <div>
          <TextField.Input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            size="3"
          />
        </div>
        <div className="text-center mb-5 space-x-10">
          <DropdownMenu.Root
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
          >
            <DropdownMenu.Trigger>
              <button className="bg-white w-[26.5rem] hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                Assigned to
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {users &&
                users.length > 0 &&
                users.map((u) => (
                  <DropdownMenu.Item>{u.name}</DropdownMenu.Item>
                ))}
              <DropdownMenu.Separator />
              <DropdownMenu.Item>not-assigned </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <DropdownMenu.Root
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <DropdownMenu.Trigger>
              <button className="bg-white w-[26.5rem] hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                {formData.status}
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item>Open</DropdownMenu.Item>
              <DropdownMenu.Item>Closed</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item>In-Progress</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
        <div className="pt-5">
          <Button type="submit" variant="classic">
            Create Ticket
          </Button>
        </div>
      </form>
    </div>
  )
}

export default NewTicket
