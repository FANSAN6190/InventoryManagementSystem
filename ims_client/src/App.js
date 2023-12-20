
import React,{useEffect, useState} from 'react'
import Main from './components/Main/Main';

function App() {
  const [backendData, setBackendData] = useState([{}]);
  
  useEffect(()=>{
    fetch(`https://localhost:5600/data`).then(
//    fetch(`https://localhost:${process.env.MSPORT}/data`).then(
      response=>response.json()
    ).then(
      data=>setBackendData(data)
    )
  },[])
  console.log(backendData.results);

  return (
    /* <div>
      {(typeof backendData.results==='undefined')?(
        <p>Loading...</p>
      ):(backendData.results.map((user,i) => {
        return (
          <div key={i}>
            <h1>User {i+1}</h1>
            <p>User_ID: {user.user_id}</p>
            <p>First Name: {user.first_name}</p>
            <p>Midle Name: {user.mid_name}</p>
            <p>Last Name: {user.last_name}</p>
            <p>DOB: {new Date(user.dob).toLocaleDateString()}</p>
            <p>Email: {user.email}</p>
            <p>Phone No.: {user.phone}</p>
          </div>
        )
      }))
      }
    </div> */
    <Main></Main>
  )
}

export default App