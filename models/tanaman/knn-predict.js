function euclideanDistance(point1, point2) {
  let sum = 0;
  for (let i = 0; i < point1.length; i++) {
    sum += Math.pow(point1[i] - point2[i], 2);
  }
  return Math.sqrt(sum);
}

function knnPredict(X_train, y_train, x_test) {
  k = 5;
  // Menyimpan jarak dan label data latih
  const distances = [];
  for (let i = 0; i < X_train.length; i++) {
    const distance = euclideanDistance(X_train[i], x_test);
    distances.push({ distance, label: y_train[i] });
  }

  // Mengurutkan berdasarkan jarak dari terkecil ke terbesar
  distances.sort((a, b) => a.distance - b.distance);

  // Memilih K tetangga terdekat
  const neighbors = distances.slice(0, k);

  // Menghitung jumlah munculnya setiap label
  const labelCounts = {};
  for (let i = 0; i < neighbors.length; i++) {
    const label = neighbors[i].label;
    labelCounts[label] = (labelCounts[label] || 0) + 1;
  }

  // Menentukan label yang paling sering muncul di antara K tetangga terdekat
  let maxCount = 0;
  let predictedLabel;
  for (const label in labelCounts) {
    if (labelCounts[label] > maxCount) {
      maxCount = labelCounts[label];
      predictedLabel = label;
    }
  }

  return predictedLabel;
}

module.exports = knnPredict;
