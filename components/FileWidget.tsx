import React, { ReactNode } from "react";
import { useDropzone } from "react-dropzone";

export type FileWithPreview = File & { preview: string };

interface FileWidgetProps {
    className?: string;
    children: ReactNode;
    maxFiles: number;
    handleFiles: (files: FileWithPreview[]) => void;
}

export default function FileWidget(props: FileWidgetProps) {
    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: props.maxFiles,
        accept: {
            "image/*": [],
        },
        onDrop: (acceptedFiles) => {
            const filesWithPreview = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );
            props.handleFiles(filesWithPreview);
        },
    });

    return (
        <div {...getRootProps({ className: `dropzone ${props.className}` })}>
            <input {...getInputProps()} />
            {props.children}
        </div>
    );
}
