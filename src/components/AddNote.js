import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/noteContext';

const AddNote = () => {
    
        const context = useContext(noteContext)
        const {addNote } = context;

        const  [note, setnote] = useState({title:"", description:"", tag:"default"})
        const handleSubmit=(e)=>{
            e.preventDefault();
            addNote(note.title, note.description, note.tag);
        }
        const onchange=(e)=>{
            setnote({...note,[e.target.name]: e.target.value })
        }
    return (
        <div className="container my-3">
            <h2>Add a Note</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp"  onChange={onchange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name="description" onChange={onchange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="tag" className="form-control" id="tag" name="tag" onChange={onchange}/>
                </div>
                <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Add Note</button>
            </form>
        </div>
    )
}

export default AddNote
