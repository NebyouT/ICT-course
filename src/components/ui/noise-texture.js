// Generate a noise texture data URL
export const generateNoiseTexture = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 100;
  canvas.height = 100;

  // Create noise pattern
  const imageData = ctx.createImageData(100, 100);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const value = Math.floor(Math.random() * 255);
    data[i] = value;     // red
    data[i + 1] = value; // green
    data[i + 2] = value; // blue
    data[i + 3] = 15;    // alpha (very subtle)
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png', 0.5);
};

// Export a pre-generated noise texture for static usage
export const noiseTexture = "data:image/png;base64,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";
