import React, { useState, useEffect } from "react"
import axios from "axios"
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarController,
  BarElement,
} from "chart.js"

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarController,
  BarElement
)
import { Bar } from "react-chartjs-2"

const Home = () => {
  const [ticketCounts, setTicketsCount] = useState([])
  const [tickets, setTickets] = useState([])
  useEffect(() => {
    const fetchTicketCounts = async () => {
      try {
        const response = await axios.get("http://localhost:1111/tickets")
        setTicketsCount(response.data)
        const response2 = await axios.get(
          "http://localhost:1111/tickets/latest"
        )
        setTickets(response2.data)
      } catch (error) {
        console.error("Error fetching ticket counts:", error)
        return []
      }
    }
    fetchTicketCounts()
  }, [])
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Dashboard",
        font: {
          size: 25, // Set the font size here
        },
      },
    },
  }
  return (
    <div className="container flex flex-row mx-[120px] ">
      <div className="w-1/2 h-[450px] mt-10">
        <div className="grid grid-cols-3  my-5 ">
          <span className="text-gray-100 font-medium  ">Closed Issues</span>
          <span className="text-gray-100 font-medium ">Open Issues</span>
          <span className="text-gray-100 font-medium ">In-progress Issues</span>
        </div>
        <div className="grid grid-cols-3  mb-5 space-x-3 ">
          <span className=" font-medium text-2xl textce-center text-gray-100">
            {" "}
            {ticketCounts[0]}{" "}
          </span>
          <span className="text-gray-100 text-2xl  font-medium ">
            {ticketCounts[1]}
          </span>
          <span className="text-gray-100 font-medium text-2xl  ">
            {ticketCounts[2]}
          </span>
        </div>

        <Bar
          datasetIdKey="id"
          options={options}
          className=""
          data={{
            labels: ["Open", "Closed", "In-progress"],
            datasets: [
              {
                label: "Open", // Make sure the label matches the labels array
                data: ticketCounts,
                backgroundColor: "rgba(191, 128, 255, 0.5)",
                borderWidth: 2,
                barThickness: 70,
              },
            ],
          }}
        />
      </div>

      <div className="w-full absolute my-5 right-5 max-w-md p-4 bg-white  shadow sm:p-8 dark:bg-gray-800 ">
        <div className="flow-root relative top-0 right-60 w-96 h-auto">
          <h5 className="text-xl font-bold  mb-5 leading-none text-gray-900 dark:text-white">
            Latest Issues
          </h5>
          <ul role="list" className="h-96">
            {tickets.map((ticket, index) => (
              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0"></div>
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      Pagination not working...
                    </p>
                    <div className=" block  text-[13px] bg-red-100 font-medium mt-2 mb-3 py-1 pr-0 pl-3 w-[55px] rounded text-red-800">
                      open
                    </div>
                  </div>

                  <img
                    className="w-8 h-8 mb-5 rounded-full object-cover"
                    src="../../public/pic.jpg"
                    alt="Neil image"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Home
