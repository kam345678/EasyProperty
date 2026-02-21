const uploadFile = async (file: File, type: string) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/upload/${type}`,
    {
      method: 'POST',
      body: formData,
    },
  );

  return res.json();
};