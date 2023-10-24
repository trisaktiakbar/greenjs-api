function minMaxNormalization(data, min, max) {
  const normalizedData = data.map((value) => (value - min) / (max - min));
  return normalizedData;
}

function inverseMinMaxNormalization(normalizedData, min, max) {
  const originalData = normalizedData.map((value) => value * (max - min) + min);
  return originalData;
}

module.exports = { minMaxNormalization, inverseMinMaxNormalization };
