import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Props = {
  urls: string[];
  type: string;
};

const ImagePerview = ({ urls, type }: Props) => {
  const [mediaTypes, setMediaTypes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const checkMediaType = async () => {
      const newMediaTypes: { [key: string]: string } = {};
      await Promise.all(
        urls.map(async (url) => {
          try {
            const response = await fetch(url, { method: "HEAD" });
            const contentType = response.headers.get("content-type");
            if (contentType) {
              newMediaTypes[url] = contentType.startsWith("video/")
                ? "video"
                : "image";
            }
          } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            newMediaTypes[url] = "unknown";
          }
        })
      );
      setMediaTypes(newMediaTypes);
    };

    checkMediaType();
  }, [urls]);

  return (
    <div
      className={cn("grid gap-2 justify-items-start", {
        "grid-cols-1": urls.length === 1,
        "grid-cols-2": urls.length > 1,
      })}
    >
      {urls.map((url, index) => {
        const isVideo = mediaTypes[url] === "video";

        return (
          <Dialog key={index}>
            <div
              className={cn("relative cursor-pointer", {
                "w-28 h-28 max-w-full": !isVideo,
              })}
            >
              <DialogTrigger asChild>
                {type === "image" ? (
                  <Image
                    src={url}
                    alt={"Uploaded Image"}
                    referrerPolicy="no-referrer"
                    className="rounded-md"
                    layout="fill"
                    objectFit="cover"
                  />
                ) : type === "file" && isVideo ? (
                  <div className="aspect-w-16 aspect-h-9 h-full">
                    <video
                      poster={url}
                      className="object-cover w-full h-full rounded-md"
                    >
                      <source src={`${url}#t=0.1`} type="video/mp4" />
                    </video>
                  </div>
                ) : null}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {isVideo ? "Video Preview" : "Image Preview"}
                  </DialogTitle>
                </DialogHeader>
                <div className="w-full h-96 relative flex items-center justify-center">
                    {isVideo? <video controls poster={url} className="w-full">
                        <source src={`${url}#t=0.1`} type="video/mp4" />
                    </video> : type==="image" ? <Image alt="Uploaded Image" src={url} referrerPolicy="no-referrer" layout="fill" objectFit="contain" /> : null}
                </div>
              </DialogContent>
            </div>
          </Dialog>
        );
      })}
    </div>
  );
};

export default ImagePerview;
