import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import {
  Tabs,
  Box,
  Text,
  Avatar,
  Flex,
  Card,
  Table,
  Badge,
  Heading,
} from "@radix-ui/themes"
import { Link } from "react-router-dom"

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
  const [user, setUser] = useState(null)
  const [colleagues, setColleagues] = useState(null)
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const employee_id = localStorage.getItem("user_id")

        const response = await axios.get(
          `http://localhost:1111/users/${employee_id}`,
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        )
        console.log(response.data)
        setUser(response.data)
        const response2 = await axios.get(
          "http://localhost:1111/users/colleagues",
          {
            headers: {
              "x-auth-token": localStorage.getItem("token"),
            },
          }
        )
        console.log(response2.data, " this is colleagues")
        setColleagues(response2.data)
      } catch (error) {
        toast("could not fetch the employee")
        console.error("Error fetching employee details:", error.message, error)
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="container mx-auto my-5">
      {isPerformanceModalOpen && (
        <PerformanceModal
          onClose={() => setIsPerformanceModalOpen(false)}
          employeeId={localStorage.getItem("user_id")}
        />
      )}
      <div className="mx-auto max-w-4xl mb-40 ">
        {user && (
          <div className="flex flex-col space-y-0 mb-5 items-center justify-center">
            <Avatar fallback="A" size="6" className="mx-80 mt-5 mb-3" />
            <Heading>{user.name}</Heading>
            <Text>{user.email}</Text>
          </div>
        )}
        {user && (
          <Flex gap="3" direction="row" align="center" justify="center">
            <Card size="2" style={{ width: 350 }}>
              <Flex gap="3" align="center">
                <Avatar size="4" radius="full" fallback="P" color="indigo" />
                <Box>
                  <Text as="div" weight="bold">
                    Points
                  </Text>
                  <Text as="div" color="gray">
                    {user?.Performance?.points || 0}
                  </Text>
                </Box>
              </Flex>
            </Card>

            <Card size="2" style={{ width: 425 }}>
              <Flex gap="4" align="center">
                <Avatar size="4" radius="full" fallback="P" color="indigo" />
                <Box>
                  <Text as="div" weight="bold">
                    punctuality score
                  </Text>
                  <Text as="div" color="gray">
                    12
                  </Text>
                </Box>
              </Flex>
            </Card>

            <Card size="2" style={{ width: 500 }}>
              <Flex gap="4" align="center">
                <Avatar size="4" radius="full" fallback="L" color="indigo" />
                <Box>
                  <Text as="div" weight="bold">
                    Department
                  </Text>
                  <Text as="div" color="gray">
                    {user.Department.name}
                  </Text>
                </Box>
              </Flex>
            </Card>
          </Flex>
        )}
        <Tabs.Root defaultValue="account">
          <Tabs.List>
            <Tabs.Trigger value="account">Account</Tabs.Trigger>
            <Tabs.Trigger value="colleagues">Colleagues</Tabs.Trigger>
            <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
          </Tabs.List>

          <Box px="4" pt="3" pb="2">
            <Tabs.Content value="account">
              <div className="flow-root w-[600px] rounded-md relative top-0 right-60 p-5 border-2  ml-80 h-auto ">
                <h5 className="text-xl font-bold  mb-5 leading-none text-gray-900 dark:text-white">
                  Saved Issues
                </h5>
                <Table.Root className="w-[550px]">
                  <Table.Body size="3">
                    {user &&
                      user.mySavedTickets.map((ticket) => (
                        <Table.Row key={ticket.savedTicket.id}>
                          <Table.RowHeaderCell>
                            <div className="flex flex-col  space-y-4">
                              <Link to={`/tickets/${ticket.savedTicket.id}`}>
                                <Text size="3" weight="regular">
                                  {ticket.savedTicket.name || "title"}
                                </Text>
                              </Link>
                              <Badge size="1" color="red" className="w-[50px]">
                                {ticket.savedTicket.status}
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
            </Tabs.Content>
            <div className="mx-auto ">
              <Tabs.Content value="colleagues">
                {colleagues && colleagues.length > 0 ? (
                  colleagues.map((user) => (
                    <Card style={{ maxWidth: 240 }}>
                      <Flex gap="3" align="center">
                        <Avatar size="3" fallback="T" />
                        <Box>
                          <Text as="div" size="2" weight="bold">
                            {user.name}
                          </Text>
                          <Text as="div" size="2" color="gray">
                            {user.email}
                          </Text>
                        </Box>
                      </Flex>
                    </Card>
                  ))
                ) : (
                  <Text>No colleagues, make some man!</Text>
                )}
              </Tabs.Content>
            </div>
            <Tabs.Content value="settings">
              <div className="flow-root w-[600px] rounded-md relative top-0 right-60 p-5 border-2  ml-80 h-auto ">
                <h5 className="text-xl font-bold  mb-5 leading-none text-gray-900 dark:text-white">
                  My Issues
                </h5>
                <Table.Root className="w-[550px]">
                  <Table.Body size="3">
                    {user &&
                      user.mySavedTickets.map((ticket) => (
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
            </Tabs.Content>
          </Box>
        </Tabs.Root>{" "}
      </div>
    </div>
  )
}

export default Profile
//
