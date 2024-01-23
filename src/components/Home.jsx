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
  useEffect(() => {
    const fetchTicketCounts = async () => {
      try {
        const response = await axios.get("http://localhost:1111/tickets")
        setTicketsCount(response.data)
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
          size: 16, // Set the font size here
        },
      },
    },
  }
  return (
    <div className="container  mx-3 p-3">
      <div className="w-1/2 h-[450px]">
        <Bar
          datasetIdKey="id"
          options={options}
          className="h-full"
          data={{
            labels: ["Open", "Closed", "In-Progress"],
            datasets: [
              {
                id: 1,
                label: "Open",
                data: [7, 5, 6],
                backgroundColor: "rgba(191, 128, 255, 0.5)", // Specify the color for "Open"
                borderWidth: 2,
                barThickness: 80,
              },
            ],
          }}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Ticket Counts</h3>
        <div className="flex justify-between">
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">
              {ticketCounts[0]}
            </p>
            <p className="text-gray-600">Open Issues</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-red-600">{ticketCounts[1]}</p>
            <p className="text-gray-600">Closed Issues</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-yellow-600">
              {ticketCounts[2]}
            </p>
            <p className="text-gray-600">In Progress Issues</p>
          </div>
        </div>
      </div>
      <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Latest Customers
          </h5>
          <a
            href="#"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            View all
          </a>
        </div>
        <div className="flow-root">
          <ul
            role="list"
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            <li className="py-3 sm:py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="w-8 h-8 rounded-full"
                    src="/docs/images/people/profile-picture-1.jpg"
                    alt="Neil image"
                  />
                </div>
                <div className="flex-1 min-w-0 ms-4">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    Neil Sims
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    email@windster.com
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  $320
                </div>
              </div>
            </li>
            <li className="py-3 sm:py-4">
              <div className="flex items-center ">
                <div className="flex-shrink-0">
                  <img
                    className="w-8 h-8 rounded-full"
                    src="/docs/images/people/profile-picture-3.jpg"
                    alt="Bonnie image"
                  />
                </div>
                <div className="flex-1 min-w-0 ms-4">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    Bonnie Green
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    email@windster.com
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  $3467
                </div>
              </div>
            </li>
            <li className="py-3 sm:py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="w-8 h-8 rounded-full"
                    src="/docs/images/people/profile-picture-2.jpg"
                    alt="Michael image"
                  />
                </div>
                <div className="flex-1 min-w-0 ms-4">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    Michael Gough
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    email@windster.com
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  $67
                </div>
              </div>
            </li>
            <li className="py-3 sm:py-4">
              <div className="flex items-center ">
                <div className="flex-shrink-0">
                  <img
                    className="w-8 h-8 rounded-full"
                    src="/docs/images/people/profile-picture-4.jpg"
                    alt="Lana image"
                  />
                </div>
                <div className="flex-1 min-w-0 ms-4">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    Lana Byrd
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    email@windster.com
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  $367
                </div>
              </div>
            </li>
            <li className="pt-3 pb-0 sm:pt-4">
              <div className="flex items-center ">
                <div className="flex-shrink-0">
                  <img
                    className="w-8 h-8 rounded-full"
                    src="/docs/images/people/profile-picture-5.jpg"
                    alt="Thomas image"
                  />
                </div>
                <div className="flex-1 min-w-0 ms-4">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    Thomes Lean
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    email@windster.com
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  $2367
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Home
