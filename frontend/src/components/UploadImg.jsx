import React, { useState, useEffect } from "react";

const UploadImg = ({ 
  label,
  existingImages = [],
  onImagesChange, // Callback khi có thay đổi ảnh
  cloudinaryBaseUrl = "https://res.cloudinary.com/dytiq61hf/image/upload/v1744375449",
}) => {
  const [newImages, setNewImages] = useState([]); // {id, file, preview, base64}
  

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve({
        base64: reader.result,
        preview: URL.createObjectURL(file)
      });
      reader.onerror = error => reject(error);
    });
  };

  const handleFileInputChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    try {
      const newImagePromises = files.map(async (file) => {
        const { base64, preview } = await fileToBase64(file);
        return {
          id: Date.now() + Math.random(),
          file,
          preview,
          base64
        };
      });
      const addedImages = await Promise.all(newImagePromises);
      setNewImages(prev => [...prev, ...addedImages]);
    } catch (error) {
      console.error("Error reading files:", error);
    }
    e.target.value = "";
  };

  const handleDeleteNewImage = (id) => {
    setNewImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      return updated;
    });
  };

  const handleDeleteExistingImage = (publicId) => {
    onImagesChange({
      deletedExisting: publicId,
      newImages: newImages.map(({ base64, file }) => ({ base64, file }))
    });
  };

  useEffect(() => {
    onImagesChange({
      newImages: newImages.map(({ base64, file }) => ({ base64, file })),
      existingImages
    });
  }, [newImages, existingImages]);

  useEffect(() => {
    return () => {
      newImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [newImages]);

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
          accept="image/*"
          onChange={handleFileInputChange}
          className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4">
        {/* Ảnh hiện có */}
        {existingImages.map((publicId) => (
          <div key={publicId} className="relative group">
            <img
              src={`${cloudinaryBaseUrl}/${publicId}`}
              alt={`hotel-${publicId}`}
              className="w-full h-32 object-cover rounded shadow"
            />
            <button
              type="button"
              onClick={() => handleDeleteExistingImage(publicId)}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition duration-200"
            >
              ✕
            </button>
          </div>
        ))}
        
        {/* Ảnh mới */}
        {newImages.map((img) => (
          <div key={img.id} className="relative group">
            <img
              src={img.preview}
              alt={`preview-${img.id}`}
              className="w-full h-32 object-cover rounded shadow"
            />
            <button
              type="button"
              onClick={() => handleDeleteNewImage(img.id)}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition duration-200"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadImg;