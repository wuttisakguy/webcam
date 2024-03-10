const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = 3001;

const axios = require("axios");
const FormData = require("form-data");

const corsOptions = {
  origin: "*",
  credential: true,
  methods: "GET, POST",
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));

app.post("/upload", async (req, res) => {
  const { imageSrc, selectedOption, textInputValuePosition } = req.body;
  const matches = imageSrc.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
  
  try {
    const response = await axios.post(
      "http://localhost:5000/meter_reading",
      {
        type: selectedOption,
        position: textInputValuePosition ,
        imageSrc: matches.input,
      }
    );

    console.log(response.data)

    res.send("Image saved and sent to Flask API");
  } catch (error) {
    console.error("Error sending the image to Flask API:", error);
    res.status(500).send("Error sending the image to Flask API");
  }

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
