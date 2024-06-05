const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

router.get('/', (req, res) => {

    res.json([])
})

//Route 1: Get all ths notes using GET "/api/notes/fetchallnotes" login require
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal error occured");
    }
})
//Route 2: Add a new note using pOST "/api/notes/addnote" login require
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be atleast 6 charcter').isLength({ min: 5 }),], async (req, res) => {
        try {
            const { title, description, tag } = req.body;

            //If there are errors, return bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const savedNote = await note.save();
            res.json(savedNote)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal error occured");
        }

    })
//Route 3:update an existing note using: PUT "/api/notes/updatenote" login require
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //Create a New Object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { res.status(400).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal error occured");
    }
})
//Route 4:delete an existing note using: DElETE "/api/notes/deltenote" login require
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {

        //Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { res.status(400).send("Not Found") }

        //Allow deletion only if user own this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal error occured");
    }
})

module.exports = router 