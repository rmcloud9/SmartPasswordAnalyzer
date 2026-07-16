import { useState, useEffect } from "react";
import "./App.css";

function App() {

    // React State Variables
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [mlResult, setMlResult] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;

    // Function to call Node.js API
    async function saveUser() {

        if (username.trim() === "") {

            alert("Username is required");

            return;

        }

        if (password.trim() === "") {

            alert("Password is required");

            return;

        }

        if (password.length < 6) {

            alert("Password should be at least 6 characters");

            return;

        }

        try {

            const response = await fetch(`${API_URL}/api/users`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const result = await response.json();

            console.log(result);

            alert(result.message);

            loadUsers();

        }
        catch (error) {

            console.error(error);

            alert("Unable to connect to Node Server");

        }

    }

    async function loadUsers() {

    try {

        const response = await fetch(`${API_URL}/api/users`);

        const data = await response.json();

        console.log(data);

        setUsers(data.data);

    }
    catch (error) {

        console.error(error);

        alert("Unable to load users");

    }

}

async function deleteUser(id) {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/users/${id}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        alert(result.message);

        loadUsers();

    }
    catch (error) {

        console.error(error);

        alert("Unable to delete user");

    }

}

function editUser(user) {

    setSelectedUserId(user.id);

    setUsername(user.username);

    setPassword(user.password);

}


async function updateUser() {

    if (username.trim() === "") {

    alert("Username is required");

    return;

    }

    if (password.trim() === "") {

        alert("Password is required");

        return;

    }

    if (password.length < 6) {

        alert("Password should be at least 6 characters");

        return;

    }

    try {

        const response = await fetch(
            `${API_URL}/api/users/${selectedUserId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );

        const result = await response.json();
        console.log(result);

        alert(result.message);

        loadUsers();

        setUsername("");
        setPassword("");

        setSelectedUserId(null);

    }
    catch (error) {

        console.error(error);

        alert("Unable to update user");

    }

}

function cancelEdit() {

    setSelectedUserId(null);

    setUsername("");

    setPassword("");

}

async function analyzePassword() {

    console.log("Analyze button clicked");

    try {

        const response = await fetch(
            `${API_URL}/api/password-analysis`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    password: password
                })
            }
        );

        console.log(response);

        const result = await response.json();

        console.log(result);

        //setMlResult(result.ml);

        setAnalysis(result.ai);

    }
    catch (error) {

        console.error(error);

        alert("Unable to analyze password");

    }

}

useEffect(() => {

    loadUsers();

}, []);

console.log(users);
console.log(typeof users);
console.log(Array.isArray(users));

    return (

        <div className="container">

            <h1>User Registration</h1>

            <div>

                <label>Username</label>
                <br />

                <input
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

            </div>

            <br />

            <div>

                <label>Password</label>
                <br />

                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

            </div>

            <br />

            <>
    {
        selectedUserId === null ?

        <button onClick={saveUser}>
            Save
        </button>

        :

        <>
            <button onClick={updateUser}>
                Update
            </button>

            <button onClick={cancelEdit}>
                Cancel
            </button>
        </>
    }

    {" "}

    <button onClick={analyzePassword}>
        Analyze Password
    </button>

</>



<h2>AI Password Analysis</h2>

{analysis && (

<div className="card">

    <h2>AI Explanation</h2>

    <p>
        <b>Summary Type :</b> {typeof analysis.summary}
    </p>

    <pre>
        {JSON.stringify(analysis.summary, null, 2)}
    </pre>

    <h3>Recommendations</h3>

    <ul>

    {analysis.recommendation.map((item, index) => (

        <li key={index}>

            {typeof item === "string"
                ? item
                : item.recommendation}

        </li>

    ))}

    </ul>

</div>

)}

            <br />

            <hr />

<h2>Registered Users</h2>

<table border="1" cellPadding="10">

    <thead>

        <tr>

            <th>ID</th>
            <th>Username</th>
            <th>Password</th>
            <th>Action</th>

        </tr>

    </thead>

    <tbody>

        {users.map((user) => (

            <tr key={user.id}>

                <td>{user.id}</td>

                <td>{user.username}</td>

                <td>{user.password}</td>

                <td>

                    <button
                        onClick={() => editUser(user)}
                    >
                        Edit
                    </button>

                    {" "}

                    <button
                        onClick={() => deleteUser(user.id)}
                    >
                        Delete
                    </button>

                </td>

            </tr>

        ))}

    </tbody>

</table>

            
        </div>
        

    );

}

export default App;