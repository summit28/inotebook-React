import React from 'react'

const capitalize=  (word)=> {
    if(word==="danger"){
        word="error";
    }
  const lower =   word.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function Alert(props) {
  return (
    <div style={{height:'50px'}}>
  {props.Alert && <div className={`alert alert-${props.Alert.type} alert-dismissible fade show`} role="alert">
      <strong>{capitalize(props.Alert.type)}</strong> : {props.Alert.msg}
  </div>}
    </div>
    
  )
}

export default Alert