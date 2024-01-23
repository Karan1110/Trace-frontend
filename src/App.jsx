import React from "react"
import "@radix-ui/themes/styles.css"
import { Theme } from "@radix-ui/themes"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import ChatListPage from "./components/chats"
import ChatPage from "./components/chat"
import "./index.css"
import { Toaster } from "react-hot-toast"
import EmailVerificationForm from "./components/Mail"
import Department from "./components/Department"
import Skill from "./components/Skill"
import SignUp from "./components/SignUp"
import Profile from "./components/Profile"
import Home from "./components/Home"
import Meetings from "./components/Meetings"
import TicketDetails from "./components/Ticket"
import NewTicket from "./components/NewTicket"
import EditTicket from "./components/EditTicket"

const App = () => {
  const user_id = 7
  const xAuthToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNzA1Mzk2NjY5fQ.AQDgPr_Pu1k5fFlCUYHMIcK3GfQghtspSMjmP0CzrAI"

  return (
    <>
      <Theme>
        <Toaster />
        <Navbar />
        <Router>
          <Routes>
            <Route
              path="/chats/:id"
              element={<ChatPage user_id={user_id} xAuthToken={xAuthToken} />}
            />
            <Route path="/chat" element={<ChatListPage />} />
            <Route path="/verify" element={<EmailVerificationForm />} />
            <Route path="/departments" element={<Department />} />
            <Route path="/skills" element={<Skill />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
            <Route path="/tickets/:id" element={<TicketDetails />} />
            <Route path="/edit/:id" element={<EditTicket />} />
            <Route path="/new" element={<NewTicket />} />
            <Route path="/meetings" element={<Meetings />} />
          </Routes>
        </Router>
      </Theme>
    </>
  )
}

export default App
