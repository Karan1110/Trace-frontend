// SkillForm.js
import React, { useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"

const Skill = () => {
  const [name, setName] = useState("")
  const [level, setLevel] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post("http://localhost:1111/skills", {
        name: name,
        level: level,
      })

      console.log("Skill created:", response.data)
      toast.success("the skill was created!")
      // Reset the form after successful submission
      setName("")
      setLevel("")
    } catch (error) {
      toast(error.message)
      console.error("Error creating skill:", error)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-[75px]">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Skill Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Enter skill name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="level"
          >
            Skill Level
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="level"
            type="text"
            placeholder="Enter skill level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create Skill
          </button>
        </div>
      </form>
    </div>
  )
}

export default Skill
