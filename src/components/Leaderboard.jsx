import React, { useState, useEffect } from "react"
import axios from "axios"
import { Table } from "@radix-ui/themes"
import { toast } from "react-hot-toast"

const Leaderboard = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1111/performances/leaderboard",
          {
            headers: {
              "x-auth-token": localStorage.getItem("token"),
            },
          }
        )
        setUsers(response.data)
      } catch (error) {
        toast.error("Something failed...")
        console.error(error.message, error)
      }
    }

    fetchData()
  }, []) // Empty dependency array ensures the effect runs once on mount

  return (
    <div className="mx-auto max-w-4xl p-4 ">
      <Table.Root className="max-w-2xl">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>user</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell align="right">
              points
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell align="right">
              department
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {users &&
            users.length > 0 &&
            users.map((user) => (
              <Table.Row key={user.id}>
                <Table.RowHeaderCell>{user.User.name}</Table.RowHeaderCell>
                <Table.Cell>{user.points}</Table.Cell>
                <Table.Cell>{user.User.Department.name}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    </div>
  )
}

export default Leaderboard
