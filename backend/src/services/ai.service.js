const axios = require("axios");
const fs = require("fs");

const FormData = require("form-data");
const AI_SERVICE_URL = "http://127.0.0.1:8000/voice/detect";

const sendAudioToAI = async (file) => {
    try {
        console.log("Sending:", file.path);

        const header = fs.readFileSync(file.path).slice(0, 16);

        console.log("Header:", header);
        const formData = new FormData();
        formData.append(
            "file",
            fs.createReadStream(file.path),
            {
                filename: file.originalname,
                contentType: file.mimetype
            }
        );


        const response = await axios.post(
            AI_SERVICE_URL,
            formData,
            {
                headers: formData.getHeaders()
            }
        );

        return response.data;

    } catch (error) {

        console.error("AI Service Error:");

        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }

        throw error;
    }
};

module.exports = sendAudioToAI;