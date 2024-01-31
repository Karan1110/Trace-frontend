import React, { useState, useEffect } from "react"
import moment from "moment"
import axios from "axios"
import { useParams } from "react-router-dom"
import {
  Heading,
  Text,
  AlertDialog,
  Flex,
  Button,
  Badge,
  Select,
  Popover,
  TextArea,
  Box,
  Avatar,
} from "@radix-ui/themes"
import Spinner from "./Spinner"

import { TrashIcon, CaretDownIcon, Pencil2Icon } from "@radix-ui/react-icons"
import MarkdownEditor from "@uiw/react-markdown-editor"
import { toast } from "react-hot-toast"

const Ticket = () => {
  const [ticket, setTicket] = useState(null)
  const [content, setContent] = useState("")
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(1)
  const { id } = useParams()
  const save = async () => {
    try {
      await axios.post(
        `http://localhost:1111/tickets/save/${ticket.id}`,
        {},
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      )
      toast.success("saved!")
    } catch (ex) {
      toast(ex.message)
      console.error(ex)
    }
  }

  useEffect(() => {
    // Fetch ticket details
    console.log("id is ", id)
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`http://localhost:1111/tickets/${id}`)
        setTicket(response.data)

        console.log(response.data)
      } catch (error) {
        console.error("Error fetching ticket details:", error)
      }
    }

    // Fetch list of users
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:1111/users", {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        })
        setUsers(response.data)
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchTicket()
    fetchUsers()
  }, [id])

  const addComment = async () => {
    await axios.post(
      "http://localhost:1111/comments",
      {
        content: content,
        ticket_id: ticket.id,
      },
      {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      }
    )
    toast.success("comment sent!")
    ticket.Comments.push({
      content: content,
      ticket_id: ticket.id,
      user_id: localStorage.getItem("user_id"),
    })
  }

  useEffect(() => {
    const handleAssign = async () => {
      try {
        // Call API to assign ticket to selected user
        await axios.put(
          `http://localhost:1111/tickets/assign/${id}`,
          {
            user_id: selectedUser,
          },
          {
            headers: {
              "x-auth-token": localStorage.getItem("token"),
            },
          }
        )

        // Display success message or perform additional actions
        console.log("Ticket assigned successfully!")
      } catch (error) {
        console.error("Error assigning ticket:", error)
      }
    }
    handleAssign()
  }, [selectedUser])
  const markdown = `# Hello, world!

This is **Markdown Parser React**, a *flexible* Markdown renderer.

## Syntax Highlighting

\`\`\`javascript
const message = 'Hello, world!';
console.log(message);
\`\`\``

  return (
    <>
      <div className="max-w-4xl  flex flex-row my-10 mt-[40px] mx-[250px] w-[1000px]">
        {ticket && (
          <>
            <div>
              <Heading className="text-2xl mt-[75px] font-bold mb-4">
                {ticket.name}
              </Heading>
              <div className="my-2  space-x-3  ">
                <Badge color={ticket.status == "open" ? "red" : "green"}>
                  {ticket.status}
                </Badge>
                <Text weight="medium"> Fri Jan 17 2023</Text>
              </div>
              <div className="border-2 p-7 w-100 rounded-lg mb-0 mt-5 ">
                <MarkdownEditor.Markdown source={ticket.body} />
              </div>
              {/* <video className="w-[250px] h-[250px] mx-auto" controls>
            <source src={ticket.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video> */}
            </div>
          </>
        )}

        {!ticket && <Spinner />}
        <div className="absolute right-60 w-[200px] ml-20  flex flex-col space-y-5">
          {ticket && (
            <Select.Root defaultValue={ticket.user_id}>
              <Select.Trigger>
                <Button variant="outline">
                  <CaretDownIcon />
                </Button>
              </Select.Trigger>
              <Select.Content color="purple">
                {users.map((user) => (
                  <Select.Item
                    onClick={() => setSelectedUser(user.id)}
                    value={user.id}
                  >
                    {user.name}
                  </Select.Item>
                ))}
                <Select.Item value={null}>Not Assigned</Select.Item>
              </Select.Content>
            </Select.Root>
          )}

          <Button variant="solid" color="purple">
            Edit <Pencil2Icon />
          </Button>
          {ticket && (
            <Button variant="solid" color="violet" onClick={() => save()}>
              {ticket.User.mySavedTickets.some((s) => s.ticket_id == ticket.id)
                ? "unsave"
                : "save"}
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.5 2C3.22386 2 3 2.22386 3 2.5V13.5C3 13.6818 3.09864 13.8492 3.25762 13.9373C3.41659 14.0254 3.61087 14.0203 3.765 13.924L7.5 11.5896L11.235 13.924C11.3891 14.0203 11.5834 14.0254 11.7424 13.9373C11.9014 13.8492 12 13.6818 12 13.5V2.5C12 2.22386 11.7761 2 11.5 2H3.5Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </Button>
          )}
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button variant="solid" color="red">
                Delete <TrashIcon />
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content style={{ width: 450 }}>
              <AlertDialog.Title>Delete the ticket</AlertDialog.Title>
              <AlertDialog.Description size="2">
                This action is not reversable, kindly think twice
              </AlertDialog.Description>

              <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button variant="solid" color="red">
                    Delete
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </div>
      </div>
      <div className="max-w-xl  flex flex-col my-10 mt-[40px] mx-[250px] ">
        <Heading my="3" className="ml-10">
          {" "}
          Comments
        </Heading>
        <Flex direction="column">
          {ticket &&
            ticket.Comments.map((comment) => {
              const timeAgo = moment(comment.createdAt).fromNow()
              return (
                <div className="max-w-xl p-3  flex items-center border-b   my-2 rounded-md">
                  <Avatar fallback="A" size="2" m="2" />
                  <Text as="p" size="3" mx="3">
                    {comment.content || "empty comment"}
                  </Text>
                  <Badge mx="5" className="absolute right-[700px]">
                    {timeAgo}
                  </Badge>
                </div>
              )
            })}
          {!ticket && <Spinner />}
          <Popover.Root>
            <Popover.Trigger>
              <Button variant="soft">Comment</Button>
            </Popover.Trigger>
            <Popover.Content style={{ width: 360 }}>
              <Flex gap="3">
                <Avatar size="2" fallback="A" />
                <Box grow="1">
                  <TextArea
                    placeholder="Write a comment…"
                    style={{ height: 80 }}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <Popover.Close>
                    <Button size="1" mt="3" onClick={() => addComment()}>
                      Comment
                    </Button>
                  </Popover.Close>
                </Box>
              </Flex>
            </Popover.Content>
          </Popover.Root>
        </Flex>
      </div>
    </>
  )
}

export default Ticket
