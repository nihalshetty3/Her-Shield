const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

exports.analyzeSnapshot = async (
    incidentId,
    imagePath
)=> {
    const form = new FormData();

    form.append(
        "image",
        fs.createReadStream(imagePath)
    );

    form.append(
        "incidentId",
        incidentId
    );

    const response = await axios.post(
        "http://localhost:8000/vision/analyze",

        form,
        {
            headers:form.getHeaders()
        }
    );
    return response.data;
}