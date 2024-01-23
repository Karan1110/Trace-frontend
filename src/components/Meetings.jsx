import React, { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import {  useNavigate } from "react-router-dom"

const Meetings = () => {
  const [meetings, setMeetings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const history = useNavigate();

  const addMeetingToSchedule = async (meetingId) => {
    try {
      const response = await axios.post(
        "http://localhost:1111/meetings",
        {
          meeting_id: meetingId,
        },
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      )

      console.log("Meeting added to schedule successfully:", response.data)
      toast.success("done!")
      // Additional actions or logging can be added here
      return response.data // You can return the meeting data if needed
    } catch (error) {
      toast(error.message)
      console.error("Error adding meeting to schedule:", error)
      throw new Error("Failed to add meeting to schedule")
    }
  }

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get("http://localhost:1111/meetings", {
          headers: {
            "x-auth-token": localStorage.getItem("token"), // Include your authentication token if required
          },
        })

        setMeetings(response.data)
        setTimeout(() => {
          setIsLoading(false)
        }, 2000)
      } catch (error) {
        console.error("Error fetching meetings:", error.message, error)
      }
    }

    fetchMeetings()
  }, [])

  if (isLoading) {
    return (
      <div className="text-center mt-[100px]">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto  mt-[100px]">
      <h2 className="text-2xl font-bold mb-4">Meetings List</h2>
      <button className="bg-white hover:bg-gray-100 text-gray-800 absolute top-0 right-5 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
        <span className="text-xl">+</span>
        Add
      </button>
      <ul className="divide-y divide-gray-300">
        {meetings &&
          meetings.map((meeting) => (
            <li key={meeting.id} className="py-4  ">
              <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {meeting.name}
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {meeting.description ||
                    "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order."}
                </p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  <span className="mx-2 bg-red-50 text-red-300 rounded-lg px-2 py-1 text-sm font-medium ">
                    {meeting.duration}
                  </span>
                  <span className="bg-red-50 text-red-300 rounded-lg px-2 py-1 text-sm font-medium ">
                    {meeting.Department?.name || "General"}
                  </span>
                </p>
                <button
                  className="inline-flex items-center mr-3 px-3 py-2 mt-1 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={async () => await addMeetingToSchedule(meeting.id)}
                >
                  Add
                  <svg
                    className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </button>
                <a
                  href={meeting.link}
                  className="inline-flex items-center px-3 py-2 mt-1 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Read more
                  <svg
                    className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </a>
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default Meetings
