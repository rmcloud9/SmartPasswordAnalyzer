const axios = require("axios");

async function testAI() {

    try {

        const response = await axios.post(
            "http://localhost:11434/api/generate",
            {
                model: "qwen2.5:3b",
                prompt: "Analyze the password abc123. Tell me its strength, weaknesses, and suggest a stronger password.",
                stream: false
            }
        );

        console.log("===== AI RESPONSE =====");
        console.log(response.data.response);

    }
    catch (error) {

        console.error("Error calling Ollama:");

        console.error(error.message);

    }

}

testAI();