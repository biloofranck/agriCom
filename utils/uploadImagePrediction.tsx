export const uploadImageForPrediction = async (uri: string) => {
  const apiUrl = "http://0.0.0.0:8000/predict";
  const fileName = uri.split("/").pop();

  const formData = new FormData();
  formData.append("file", {
    uri: uri,
    name: fileName || "photo.jpg",
    type: "image/jpeg",
  } as any);

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json(); // { product, status, confidence }
};
