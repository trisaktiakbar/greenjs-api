const express = require("express");
const app = express();
const fs = require("fs");
const knnPredict = require("./models/tanaman/knn-predict.js");

app.use(express.static("public"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Atau sesuaikan dengan domain Anda
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/weather", (req, res) => {
  const feature = req.query.feature;
  const timestep = req.query.timestep || 30;
  res.json({
    timestep,
    model: `https://greenjs.netlify.app/api/models/lstm/timestep-${timestep}/${feature}/model.json`,
  });
});

app.get("/plant", (req, res) => {
  const filePath = "models/tanaman/knn-data.json";
  fs.readFile(filePath, "utf8", (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Terjadi kesalahan dalam membaca file JSON.");
    } else {
      result = JSON.parse(result);
      let X_train = result.input_feature;
      let Y_train = result.target;

      let data = req.query.data;
      data = JSON.parse(data);

      let input = [];
      input[0] = data.suhu; // suhu
      input[1] = data.kelembaban_udara; // Kelembaban Udara
      input[2] = data.ph_tanah; // pH Tanah
      input[3] = data.curah_hujan; // Curah Hujan

      const predictedLabel = knnPredict(X_train, Y_train, input);
      res.json(predictedLabel);
    }
  });
});

app.listen(3000, () => {
  console.log("Server berjalan di port 3000");
});
