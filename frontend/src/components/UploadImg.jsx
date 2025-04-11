import React, { useState, useEffect } from "react";

const UploadImg = ({ label, onChange, filesData = [] }) => {
  const [previewSources, setPreviewSources] = useState(filesData || []);

  useEffect(() => {
    setPreviewSources(filesData);
  }, [filesData]);
  
  useEffect(() => {
    if (onChange) {
      onChange(previewSources);
    }
  },[previewSources])

  const handleFileInputChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      await reviewFiles(files);
    }
    e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedPreview = previewSources.filter((_, index) => index !== indexToRemove);
    setPreviewSources(updatedPreview);
  };
  
  const reviewFiles = async (files) => {
    const results = [];
    for (const file of files) {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
      });
      results.push(base64);
    }
    setPreviewSources(prev => [...prev, ...results]);
  };

  return (
    <div className="my-4">
      <label className="block font-medium mb-2 mr-4 text-[18px]">
        {label}
      </label>

      <div className="relative inline-block">
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => document.getElementById("fileInput").click()}
        >
          Thêm ảnh
        </button>
        <input
          id="fileInput"
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {previewSources.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4 ">
          {previewSources.map((src, index) => (
            <div key={index} className="relative group">
              <img
                src={src}
                alt={`preview-${index}`}
                className="w-full h-auto object-contain rounded shadow"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition duration-200"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadImg;