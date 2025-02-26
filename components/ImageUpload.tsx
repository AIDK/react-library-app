"use client";

import React, { useRef, useState } from "react";
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import config from "@/lib/config";
import ImageKit from "imagekit";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

// authenticate the user
const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);
    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;

    return { token, expire, signature };
  } catch (e) {
    throw new Error(`Authenticator failed with error: ${e}`);
  }
};

const ImageUpload = ({
  onFileChange,
}: {
  onFileChange: (filePath: string) => void;
}) => {
  // reference to IKUpload
  const ikUploadRef = useRef(null);
  // state of image
  const [file, setFile] = useState<{ filePath: string } | null>(null);

  const onError = (error: any) => {
    console.log(error);
    toast.error("Your image could not be uploaded. Please try again.");
  };
  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);

    toast.success(`${res.filePath} uploaded successfully.`);
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        className={"hidden"}
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        fileName={"test-upload.png"}
      />

      {/* upload image button */}
      <Button
        className={"upload-btn"}
        onClick={(e) => {
          // prevent browser from reloading when clicked
          e.preventDefault();

          // upload the image
          if (ikUploadRef.current) {
            // @ts-ignore
            ikUploadRef.current?.click();
          }
        }}
      >
        <Image
          src={"/icons/upload.svg"}
          alt={"upload-icon"}
          width={20}
          height={20}
          className={"object-contain"}
        />
        <p className={"text-base text-dark-100 font-bold"}>Upload a File</p>

        {/* file path */}
        {file && <p className={"upload-filename"}>{file.filePath}</p>}
      </Button>

      {/* show user when file is uploaded */}
      {file && (
        <IKImage
          alt={file.filePath}
          path={file.filePath}
          width={500}
          height={300}
        />
      )}
    </ImageKitProvider>
  );
};

export default ImageUpload;
