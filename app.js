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
  const feature_code = req.query.feature;
  let feature;

  switch (feature_code) {
    case "Tn":
      feature = "Suhu Minimum";
      break;
    case "Tx":
      feature = "Suhu Maksimum";
      break;
    case "Tavg":
      feature = "Suhu Rata-Rata";
      break;
    case "RH_avg":
      feature = "Kelembaban Rata-Rata";
      break;
    case "RR":
      feature = "Curah Hujan";
      break;
    case "ss":
      feature = "Lama Penyinaran Matahari";
      break;
    default:
      feature = undefined;
      res.status(400).json({
        error: {
          code: 400,
          message: "Parameter query tidak valid.",
          details: "Parameter 'feature' tidak valid",
        },
      });
  }

  res.json({
    feature,
    feature_code,
    model: `https://greenjs.netlify.app/api/models/lstm/${feature_code}/model.json`,
  });
});

app.get("/plant", (req, res) => {
  const filePath = "models/tanaman/knn-data.json";
  data = req.query.data;
  if (!data) {
    return res.status(400).send("Bad Request: Query parameter data is missing");
  }
  data = JSON.parse(data);

  fs.readFile(filePath, "utf8", (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Terjadi kesalahan dari sisi server.");
    } else {
      let recommendation = [];
      let input = [];
      input[0] = data.suhu; // suhu
      input[1] = data.kelembaban_udara; // Kelembaban Udara
      input[2] = data.ph_tanah; // pH Tanah
      input[3] = data.curah_hujan; // Curah Hujan

      let predictedLabel;

      result = JSON.parse(result);
      let X_train, Y_train;

      do {
        X_train = result.input_feature;
        Y_train = result.target;

        predictedLabel = knnPredict(X_train, Y_train, input);
        recommendation.push(predictedLabel);

        result.input_feature = result.input_feature.filter((_, index) => result.target[index] !== predictedLabel);
        result.target = result.target.filter((label) => label !== predictedLabel);
      } while (result.input_feature.length);

      res.status(200).json({
        rekomendasi_tanaman: recommendation,
      });
    }
  });
});

app.use(function (req, res, next) {
  res.status(404).send("404 Not Found");
});

app.listen(3000, () => {
  console.log("Server berjalan di port 3000");
});
