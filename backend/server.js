const userRoutes = require("./routes/userRoutes");
const axios = require("axios");
const express = require("express");
const cors = require("cors");

const db = require('./database/database');
const app = express();
//const { predictPassword } = require("./mlService");

const PORT = 3000;


// Allow React application to call this server
app.use(cors());

// Read JSON sent by React
app.use(express.json());

app.use("/api/users", userRoutes);

// Test API
/*app.get("/", (req, res) => {
    res.send("Welcome to Node JS Server");
});*/

// Save User API
app.post("/api/users", (req, res) => {

    console.log("Data received from React");

    console.log(req.body);
    const { username, password } = req.body;
    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.run(sql, [username, password], function (err) {
        if (err) {
            console.error("Error inserting user into database:", err.message);
            return res.status(500).json({
                status: "ERROR",
                message: "Error inserting user into database"
            });
        }
        res.json({
            status: "SUCCESS",
            message: "User received successfully",
            id: this.lastID
        });
    });
});

app.get("/api/users", (req, res) => {
    const sql = "SELECT * FROM users";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Error fetching users from database:", err.message);
            return res.status(500).json({
                status: "ERROR",
                message: "Error fetching users from database"
            });
        }
        res.json({
            status: "SUCCESS",
            message: "Users fetched successfully",
            data: rows
        });
    });
});

app.get("/api/ml-test", async (req, res) => {

    try {

        const result = await predictPassword("Abc@1234");

        res.json(result);

    }
    catch (err) {

    console.error("========== ML ERROR ==========");
    console.error(err);

    res.status(500).json({
        message: err.toString()
    });

}

});

app.put("/api/users/:id", (req, res) => {

    const id = req.params.id;

    const { username, password } = req.body;

    const sql =
        "UPDATE users SET username = ?, password = ? WHERE id = ?";

    db.run(sql, [username, password, id], function (err) {

        if (err) {

            return res.status(500).json({

                status: "ERROR",

                message: "Unable to update user"

            });

        }

        res.json({

            status: "SUCCESS",

            message: "User updated successfully"

        });

    });

});

app.delete("/api/users/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM users WHERE id = ?";

    db.run(sql, [id], function (err) {

        if (err) {

            return res.status(500).json({

                status: "ERROR",

                message: "Unable to delete user"

            });

        }

        res.json({

            status: "SUCCESS",

            message: "User deleted successfully"

        });

    });

});



/*app.post("/api/password-analysis", async (req, res) => {

    try {

        const password = req.body.password;

        // ----------------------------------
        // Step 1 : Get ML Prediction
        // ----------------------------------

        const mlResult = await predictPassword(password);

        console.log("========== ML RESULT ==========");
        console.log(mlResult);

        // ----------------------------------
        // Step 2 : Call Ollama
        // ----------------------------------

        const ollamaResponse = await axios.post(
            "http://localhost:11434/api/generate",
            {
                model: "qwen2.5:3b",

                prompt: `
                        You are a cybersecurity expert.

                        Password:
                        ${password}

                        Machine Learning Prediction:
                        ${JSON.stringify(mlResult)}

                        Explain whether the password is good or bad.

                        Give exactly 3 recommendations.

                        Return ONLY valid JSON.

                        {
                            "summary":"",
                            "recommendation":[]
                        }
                        `,

                stream: false
            }
        );

        // ----------------------------------
        // Step 3 : Raw Ollama Response
        // ----------------------------------

        console.log("========== RAW OLLAMA RESPONSE ==========");
        console.log(ollamaResponse.data.response);

        // ----------------------------------
        // Step 4 : Parse AI JSON
        // ----------------------------------

        let aiResult;

        try {

            aiResult = JSON.parse(
                ollamaResponse.data.response
            );

        }
        catch (parseError) {

            console.error("Unable to parse Ollama JSON");

            console.error(parseError);

            return res.status(500).json({

                status: "ERROR",

                message: "Ollama returned invalid JSON",

                rawResponse: ollamaResponse.data.response

            });

        }

        console.log("========== AI RESULT ==========");
        console.log(JSON.stringify(aiResult, null, 2));

        // ----------------------------------
        // Step 5 : Return Response
        // ----------------------------------

        res.json({

            status: "SUCCESS",

            ml: mlResult,

            ai: aiResult

        });

    }
    catch (err) {

        console.error("========== SERVER ERROR ==========");
        console.error(err);

        res.status(500).json({

            status: "ERROR",

            message: err.message

        });

    }

});*/
app.post("/api/password-analysis", async (req, res) => {

    try {

        const password = req.body.password;

        const ollamaResponse = await axios.post(
            "http://localhost:11434/api/generate",
            {
                model: "qwen2.5:3b",

                prompt: `
You are a cybersecurity expert.

Analyze this password:

${password}

Give a short explanation.

Give exactly 3 recommendations.

Return ONLY valid JSON.

{
    "summary":"",
    "recommendation":[]
}
`,

                stream: false
            }
        );

        const aiResult = JSON.parse(
            ollamaResponse.data.response
        );

        res.json({

            status: "SUCCESS",

            ai: aiResult

        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({

            status: "ERROR",

            message: err.message

        });

    }

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

