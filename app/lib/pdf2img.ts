export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        // Set the worker source to use local file
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        pdfjsLib = lib;
        isLoading = false;
        return lib;
    });

    return loadPromise;
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        console.log("Starting PDF conversion...");
        const lib = await loadPdfJs();
        console.log("PDF.js library loaded");

        const arrayBuffer = await file.arrayBuffer();
        console.log("File converted to ArrayBuffer");
        
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        console.log("PDF document loaded");
        
        const page = await pdf.getPage(1);
        console.log("First page retrieved");

        const viewport = page.getViewport({ scale: 4 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (!context) {
            return {
                imageUrl: "",
                file: null,
                error: "Unable to create 2D canvas context",
            };
        }

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        console.log("Rendering page to canvas...");
        await page.render({ canvasContext: context!, viewport }).promise;
        console.log("Page rendered successfully");

        const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((blob) => resolve(blob), "image/png", 1.0);
        });

        if (!blob) {
            return {
                imageUrl: "",
                file: null,
                error: "Failed to create image blob",
            };
        }

        console.log("Image blob created successfully");
        const originalName = file.name.replace(/\.pdf$/i, "");
        const imageFile = new File([blob], `${originalName}.png`, {
            type: "image/png",
        });

        return {
            imageUrl: URL.createObjectURL(blob),
            file: imageFile,
        };
    } catch (err) {
        console.error("PDF conversion error:", err);
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err instanceof Error ? err.message : String(err)}`,
        };
    }
}