'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlusIcon, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    values: string[];
}


const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    values
}) => {

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    }

    if (!mounted) {
        return null;
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                {values.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="absolute z-10 top-2 right-2">
                            <Button
                                type='button'
                                onClick={() => onRemove(url)}
                                variant='destructive'
                                size='icon'>
                                <Trash className="w-4 h-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url} />
                    </div>
                ))}
            </div>
            <CldUploadWidget onUpload={onUpload} uploadPreset="ytbavl8n">
                {({ open }) => {
                    const onClick = () => {
                        open();
                    }
                    return (
                        <Button type='button' disabled={disabled} variant='secondary' onClick={onClick}>
                            <ImagePlusIcon className="w-4 h-4 mr-2" />
                            Upload an image
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    );
}

export default ImageUpload;