import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial)

  //get all notes
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY1ZGE2MGU3ODUyYmIzNmNhNDRmOGQ2In0sImlhdCI6MTcxNzQyMjQ0OH0.d0qE_VTyD4Y4Oc6qThDTPoKk7hAtCWYKzEEnzjrgpv0"
      },
    });
    const json = await response.json()
    console.log(json)
    setNotes(json)
  }

  //Add a note
  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY1ZGE2MGU3ODUyYmIzNmNhNDRmOGQ2In0sImlhdCI6MTcxNzQyMjQ0OH0.d0qE_VTyD4Y4Oc6qThDTPoKk7hAtCWYKzEEnzjrgpv0"
      },
      body: JSON.stringify({title,description,tag})
    });

    const json = await response.json();
    console.log(json)
    
    console.log("Adding a new note")
    const note = {
      "_id": "66616775e6dddf999a7a0bcc8",
      "user": "665da60e7852bb36ca44f8d6",
      "title": title,
      "description": description,
      "tag": tag,
      "date": "2024-06-06T07:38:29.513Z",
      "__v": 0
    };
    setNotes(notes.concat(note));
  }

  //Delete a note
  const deleteNote = async (id) => {
    //api call
    console.log("deleting the note with id" + id)
    const newNote = notes.filter((note) => { return note._id !== id })
    setNotes(newNote);
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY1ZGE2MGU3ODUyYmIzNmNhNDRmOGQ2In0sImlhdCI6MTcxNzQyMjQ0OH0.d0qE_VTyD4Y4Oc6qThDTPoKk7hAtCWYKzEEnzjrgpv0"
      },
    });
    const json = response.json();
    console.log(json)
  }

  //Edit a note
  const editNote = async (id, title, description, tag) => {
    //API call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY1ZGE2MGU3ODUyYmIzNmNhNDRmOGQ2In0sImlhdCI6MTcxNzQyMjQ0OH0.d0qE_VTyD4Y4Oc6qThDTPoKk7hAtCWYKzEEnzjrgpv0"
      },
      body: JSON.stringify({title,description,tag})
    });
    const json = await response.json();
    console.log(json)
    
    let newNotes = JSON.parse(JSON.stringify(notes))
    
    //Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  }

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote,getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )
}


export default NoteState;