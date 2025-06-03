import { createWorker, PSM } from 'tesseract.js';

export interface OCRProgress {
  status: string;
  progress: number;
}

export interface OCROptions {
  language?: string;
  onProgress?: (progress: OCRProgress) => void;
}

const preprocessImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        img.src = reader.result;
      }
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context is null"));

      // Optimize image size - max width 1200px for better OCR accuracy
      const MAX_WIDTH = 1200;
      const scaleFactor = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;
      
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;

      // Draw image with scaling
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Get image data for preprocessing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Convert to grayscale and apply simple binarization
      for (let i = 0; i < data.length; i += 4) {
        // Calculate grayscale using luminance formula
        const grayscale = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        
        // Apply threshold for binarization (adjust threshold based on image characteristics)
        const threshold = 128;
        const binaryValue = grayscale > threshold ? 255 : 0;
        
        // Set RGB to binary value
        data[i] = binaryValue;     // Red
        data[i + 1] = binaryValue; // Green
        data[i + 2] = binaryValue; // Blue
        // Alpha channel (data[i + 3]) remains unchanged
      }

      // Apply processed image data back to canvas
      ctx.putImageData(imageData, 0, 0);
      
      // Convert to data URL
      const dataURL = canvas.toDataURL("image/png", 0.9);
      resolve(dataURL);
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

const cleanExtractedText = (text: string): string => {
  return text
    // Remove non-printable characters except newlines and tabs
    .replace(/[^\x20-\x7E\n\t]/g, '')
    // Remove multiple consecutive spaces
    .replace(/[ ]{2,}/g, ' ')
    // Remove multiple consecutive newlines
    .replace(/\n{3,}/g, '\n\n')
    // Trim whitespace from start and end
    .trim();
};

export const extractTextFromImage = async (
  file: File,
  options: OCROptions = {}
): Promise<string> => {
  const { language = 'eng', onProgress } = options;
  
  try {
    // Preprocess the image
    if (onProgress) {
      onProgress({ status: 'Preprocessing image...', progress: 0 });
    }
    
    const imageDataUrl = await preprocessImage(file);
    
    if (onProgress) {
      onProgress({ status: 'Initializing OCR engine...', progress: 10 });
    }

    // Create and configure Tesseract worker
    const worker = await createWorker(language, 1, {
      logger: (m) => {
        console.log('Tesseract logger:', m);
        
        if (onProgress) {
          let progress = 10; // Start after preprocessing
          let status = m.status || 'Processing...';
          
          switch (m.status) {
            case 'loading tesseract core':
              progress = 20;
              status = 'Loading OCR engine...';
              break;
            case 'initializing tesseract':
              progress = 30;
              status = 'Initializing OCR...';
              break;
            case 'loading language traineddata':
              progress = 40;
              status = 'Loading language data...';
              break;
            case 'initializing api':
              progress = 50;
              status = 'Setting up OCR...';
              break;
            case 'recognizing text':
              // Progress from 60% to 95% during recognition
              progress = 60 + (m.progress * 35);
              status = 'Extracting text...';
              break;
            default:
              if (m.progress) {
                progress = Math.max(progress, 50 + (m.progress * 40));
              }
          }
          
          onProgress({ status, progress: Math.round(progress) });
        }
      },
    });

    // Set OCR parameters for better accuracy
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      preserve_interword_spaces: '1',
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?;:()[]{}"-\'@#$%&*+=<>/\\|~`',
    });

    if (onProgress) {
      onProgress({ status: 'Recognizing text...', progress: 60 });
    }

    // Perform OCR
    const { data } = await worker.recognize(imageDataUrl);
    
    // Clean up worker
    await worker.terminate();

    if (onProgress) {
      onProgress({ status: 'Cleaning up text...', progress: 95 });
    }

    // Clean and return the extracted text
    const cleanedText = cleanExtractedText(data.text);
    
    if (onProgress) {
      onProgress({ status: 'Complete!', progress: 100 });
    }

    return cleanedText;
    
  } catch (error) {
    console.error('OCR processing error:', error);
    throw new Error(`OCR failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
