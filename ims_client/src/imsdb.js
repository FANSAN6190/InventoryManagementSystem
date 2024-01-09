import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { SERVER_URL } from "./config";

function UserTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/user`)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);
  return (
    <table className="table">
      <thead className="thead-dark">
        <tr>
          <th>User ID</th>
          <th>First Name</th>
          <th>Middle Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>DOB</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(users) &&
          users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.first_name}</td>
              <td>{user.mid_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{new Date(user.dob).toLocaleDateString()}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
export default UserTable;
