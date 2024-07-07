import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
  const [crendentials, setcrendentials] = useState({ name: "", cpassword: "", email: "", password: "" })
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = crendentials;
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password })
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      //save the authtoken and redirect
      localStorage.setItem('token', json.authtoken);
      navigate("/");
      props.showAlert("Account Created Successfully", "success")
    }
    else {
      if (json.error === "Email already exists") {
        props.showAlert("Email already exists", "danger")
      }
      else {
        props.showAlert("Invalid Details", "danger")
      }
    }

  }

  const onChange = (e) => {
    setcrendentials({ ...crendentials, [e.target.name]: e.target.value })
  };
  return (
    <div className='container mt-2'>
      <h2 className='my-y'>Create an account to use iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="my-3">
          <label htmlFor="=name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name='name' onChange={onChange} aria-describedby="emailHelp" />
        </div>
        <div className="my-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp" />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="my-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' onChange={onChange} minLength={5} required />
        </div>
        <div className="my-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="cpassword" className="form-control" id="cpassword" name='cpassword' onChange={onChange} minlength={5} required />
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Signup