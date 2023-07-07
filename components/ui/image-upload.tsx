'use client';

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}


const ImageUpload = () => {
    return (
        <div>
            image upload!
        </div>
    );
}

export default ImageUpload;