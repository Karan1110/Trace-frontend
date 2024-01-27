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
import { Table, Badge, Avatar, Text } from "@radix-ui/themes"
import { Link } from "react-router-dom"

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
    <div className="container flex flex-row ml-[50px] mr-[40px] ">
      <div className="w-1/2 h-[450px] mt-10  ">
        <div className="grid grid-cols-3  my-5  ">
          <span className="text-gray-900 font-medium  ">Closed Issues</span>
          <span className="text-gray-900 font-medium ">Open Issues</span>
          <span className="text-gray-900 font-medium ">In-progress Issues</span>
        </div>
        <div className="grid grid-cols-3  mb-5 space-x-3 ">
          <span className=" font-medium text-2xl textce-center text-gray-900">
            {" "}
            {ticketCounts[0]}{" "}
          </span>
          <span className="text-gray-900 text-2xl  font-medium ">
            {ticketCounts[1]}
          </span>
          <span className="text-gray-900 font-medium text-2xl  ">
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

      <div className=" absolute my-5 right-20 max-w-md p-4 bg-white sm:p-8 dark:bg-gray-800 ">
        <div className="flow-root w-[600px] rounded-md relative top-0 right-60 p-5 border-2 h-auto ">
          <h5 className="text-xl font-bold  mb-5 leading-none text-gray-900 dark:text-white">
            Latest Issues
          </h5>
          <Table.Root className="w-[550px]">
            <Table.Body size="3">
              {tickets.map((ticket) => (
                <Table.Row key={ticket.id}>
                  <Table.RowHeaderCell>
                    <div className="flex flex-col  space-y-4">
                      <Link to={`/tickets/${ticket.id}`}>
                        <Text size="3" weight="regular">
                          {ticket.name || "title"}
                        </Text>
                      </Link>
                      <Badge size="1" color="red" className="w-[50px]">
                        {ticket.status}
                      </Badge>
                    </div>
                  </Table.RowHeaderCell>
                  <Table.Cell />
                  <Table.Cell justify="end">
                    <Avatar fallback="A" size="2" />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
      </div>
    </div>
  )
}

export default Home
