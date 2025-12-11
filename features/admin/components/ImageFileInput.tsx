// app/ui/dashboard/control/image-file.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@heroui/button";

const ImageUploadButton = () => {
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" style={{ display: "none" }} id="image-upload" onChange={handleImageChange} />
      <label htmlFor="image-upload">
        <Button as="span">画像を選択</Button>
      </label>
      {image && (
        <div style={{ marginTop: "10px", position: "relative", width: "100%", maxWidth: "400px", height: "auto" }}>
          <Image
            src={image}
            alt="Preview"
            fill
            style={{
              objectFit: "contain",
              borderRadius: "8px",
            }}
            sizes="(max-width: 400px) 100vw, 400px"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploadButton;
