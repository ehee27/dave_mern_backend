const Note = require('../models/Note')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

const getAllNotes = asyncHandler(async (req, res) => {
  // We'll get all notes but drill down farther to also get user data
  const notes = await Note.find().lean() // lean calls just the json we need - no extea methods
  if (!notes?.length) {
    return res.status(400).json({ message: 'No notes found twoSeven' })
  }
  // mark each note with it's user - we're grabbing the UserId from the note Model attributes - map through the notes, find a user with the ID and return a spread object.
  const notesWithUser = await Promise.all(
    notes.map(async note => {
      const user = await User.findById(note.user).lean().exec() // returns a promise that will execute efficiently
      return { ...note, username: user.username }
    })
  )
  // return the specific notes with user data
  res.json(notesWithUser)
})

//------------------- CREATE NEW---------------------------------------
const createNewNote = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body
  console.log('This is the payload...', req.body)

  if (!user || !title || !text) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  // const duplicate = await Note.findOne({ title }).lean().exec()
  const duplicate = await Note.findOne({ title })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec()
  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate note title' })
  }
  // testing by setting a noteObject with payload
  const noteObject = { user, title, text }

  const note = await Note.create(noteObject)
  if (note) {
    return res.status(201).json({ message: 'New note created' })
  } else {
    return res.status(400).json({ message: 'Invalid note data received' })
  }
})

//------------------- UPDATE ---------------------------------------
const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body

  if (!id || !user || !title || !text || typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'All fields are required' })
  }
  const note = await Note.findById(id).lean().exec()
  if (!note) {
    return res.status(400).json({ message: 'Note not found' })
  }
  // Check for duplicate title
  // const duplicate = await Note.findOne({ title }).lean().exec()
  const duplicate = await Note.findOne({ title })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec()
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate note title' })
  }
  note.user = user
  note.title = title
  note.text = text
  note.completed = completed

  const updatedNote = await note.save()
  res.json(`'${updatedNote.title}' updated`)
})

//------------------- DELETE ---------------------------------------
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body
  // Confirm data
  if (!id) {
    return res.status(400).json({ message: 'Note ID required' })
  }
  // Confirm note exists to delete
  const note = await Note.findById(id).exec()
  if (!note) {
    return res.status(400).json({ message: 'Note not found' })
  }
  const result = await note.deleteOne()
  const reply = `Note '${result.title}' with ID ${result._id} deleted`
  res.json(reply)
})

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
}
