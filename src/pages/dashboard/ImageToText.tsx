
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Tesseract {
  recognize: (image: File | string, options?: { 
    logger?: (info: { status: string; progress?: number }) => void,
    lang?: string 
  }) => Promise<{ data: { text: string } }>;
  setLogging?: (level: boolean) => void;
}

declare global {
  interface Window {
    Tesseract?: Tesseract;
  }
}

const ImageToText = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState("eng");
  const [tesseractLoaded, setTesseractLoaded] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Check if Tesseract is loaded
  useEffect(() => {
    const checkTesseract = () => {
      if (window.Tesseract) {
        console.log("Tesseract.js detected and ready!");
        setTesseractLoaded(true);
        return true;
      }
      return false;
    };

    // Initial check
    if (checkTesseract()) return;

    // Set interval to check until loaded
    const intervalId = setInterval(() => {
      if (checkTesseract()) {
        clearInterval(intervalId);
      }
    }, 100);

    // Timeout after 30 seconds
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      if (!window.Tesseract) {
        console.error("Tesseract.js failed to load within 30 seconds");
        setErrorMessage("Failed to load text extraction library. Please refresh the page.");
      }
    }, 30000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, etc.)",
        });
        return;
      }

      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select an image smaller than 5MB",
        });
        return;
      }

      setImage(selectedFile);
      
      // Create an object URL for the image preview
      const objectUrl = URL.createObjectURL(selectedFile);
      setImageUrl(objectUrl);
      
      // Reset state
      setExtractedText("");
      setProgress(0);
      setProcessingStatus("");
      setErrorMessage(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Validate if it's an image
      if (droppedFile.type.startsWith('image/')) {
        setImage(droppedFile);
        
        // Create an object URL for the image preview
        const objectUrl = URL.createObjectURL(droppedFile);
        setImageUrl(objectUrl);
        
        // Reset state
        setExtractedText("");
        setProgress(0);
        setProcessingStatus("");
        setErrorMessage(null);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please drop an image file (JPG, PNG, etc.)",
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const processImage = async () => {
    if (!image) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please select an image to extract text from.",
      });
      return;
    }
    
    if (!window.Tesseract) {
      toast({
        variant: "destructive",
        title: "Tesseract not loaded",
        description: "Please wait for the text extraction library to load and try again.",
      });
      return;
    }
    
    setIsProcessing(true);
    setProgress(0);
    setExtractedText("");
    setProcessingStatus("Starting OCR...");
    setErrorMessage(null);
    
    let progressInterval: NodeJS.Timeout | null = null;
    
    try {
      console.log(`Starting OCR processing with language: ${language}...`);
      console.log("Image file:", image.name, "Size:", image.size);
      
      // Convert image to data URL for better compatibility
      const imageDataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(image);
      });
      
      console.log("Image converted to DataURL, starting Tesseract recognition...");
      setProcessingStatus("Initializing text recognition...");
      setProgress(5);
      
      // Smooth progress simulation that guarantees completion
      let currentProgress = 5;
      let progressStage = 'initializing';
      let isCompleted = false;
      
      progressInterval = setInterval(() => {
        if (isCompleted) return;
        
        // Increment progress more gradually to avoid getting stuck
        if (currentProgress < 90) {
          currentProgress += Math.random() * 6 + 2; // Random increment between 2-8
        } else if (currentProgress < 95) {
          currentProgress += Math.random() * 2 + 0.5; // Slower increment between 0.5-2.5
        }
        
        // Cap at 95% until OCR completes
        if (currentProgress > 95) {
          currentProgress = 95;
        }
        
        // Update status based on progress
        if (currentProgress > 20 && progressStage === 'initializing') {
          setProcessingStatus("Loading OCR engine...");
          progressStage = 'loading';
        } else if (currentProgress > 45 && progressStage === 'loading') {
          setProcessingStatus("Analyzing image...");
          progressStage = 'analyzing';
        } else if (currentProgress > 75 && progressStage === 'analyzing') {
          setProcessingStatus("Extracting text...");
          progressStage = 'extracting';
        } else if (currentProgress >= 95 && progressStage === 'extracting') {
          setProcessingStatus("Finalizing extraction...");
          progressStage = 'finalizing';
        }
        
        setProgress(Math.floor(currentProgress));
        console.log(`Progress: ${Math.floor(currentProgress)}% - Stage: ${progressStage}`);
      }, 600);
      
      const result = await window.Tesseract.recognize(imageDataUrl, {
        lang: language,
        logger: (info) => {
          console.log("Tesseract logger:", info);
          // Let our simulated progress handle the updates
        }
      });
      
      // Mark as completed and clear interval
      isCompleted = true;
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      
      console.log("OCR Result received:", result);
      
      // Complete the progress to 100%
      setProgress(100);
      setProcessingStatus("Text extraction complete!");
      
      if (result && result.data && typeof result.data.text === 'string') {
        const text = result.data.text.trim();
        if (text) {
          setExtractedText(text);
          toast({
            title: "Text extraction complete",
            description: "Your text has been successfully extracted from the image.",
          });
        } else {
          setExtractedText("No text was found in the image.");
          setProcessingStatus("Complete - No text found");
          toast({
            title: "No text found",
            description: "No readable text was detected in the image. Try with a clearer image.",
          });
        }
      } else {
        throw new Error("Invalid OCR result structure");
      }
    } catch (error) {
      // Clear any remaining intervals
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      console.error("Error processing image:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
      setErrorMessage(`Failed to extract text: ${errorMsg}`);
      setExtractedText("");
      setProgress(0);
      setProcessingStatus("Error occurred");
      toast({
        variant: "destructive",
        title: "Text extraction failed",
        description: "There was an error processing your image. Please try again with a different image.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      toast({
        title: "Text copied",
        description: "The extracted text has been copied to your clipboard.",
      });
    }
  };

  const handleDownloadText = () => {
    if (extractedText) {
      const element = document.createElement("a");
      const file = new Blob([extractedText], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "extracted-text.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Image to Text</h1>
        <p className="text-muted-foreground">Upload an image to extract text using OCR.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Language Selection */}
            <div className="mb-4">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eng">English</SelectItem>
                  <SelectItem value="fra">French</SelectItem>
                  <SelectItem value="spa">Spanish</SelectItem>
                  <SelectItem value="deu">German</SelectItem>
                  <SelectItem value="ita">Italian</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-muted-foreground">Select the main language in your image</p>
            </div>
            
            {/* Tesseract Loading Status */}
            {!tesseractLoaded && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700 flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded-full bg-yellow-300" />
                <span>Loading text extraction library... Please wait.</span>
              </div>
            )}
            
            {tesseractLoaded && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
                ✓ Text extraction library loaded and ready!
              </div>
            )}
            
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                {errorMessage}
              </div>
            )}
            
            {/* Drag & Drop Area */}
            <div 
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-secondary/50 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={handleUploadClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              {imageUrl ? (
                <div className="space-y-4">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="max-h-48 mx-auto object-contain rounded border"
                  />
                  <p className="text-sm text-muted-foreground">{image?.name}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <Upload size={24} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Drag & drop an image or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, WEBP (Max 5MB)</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={processImage} 
              disabled={!image || isProcessing || !tesseractLoaded}
            >
              {isProcessing ? `Processing... ${progress}%` : "Extract Text"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Results Card */}
        <Card>
          <CardHeader>
            <CardTitle>Extracted Text</CardTitle>
          </CardHeader>
          <CardContent>
            {isProcessing ? (
              <div className="space-y-4 py-8">
                <p className="text-center text-muted-foreground text-lg font-medium">
                  {processingStatus || "Processing image..."}
                </p>
                <div className="space-y-2">
                  <Progress value={progress} className="h-3" />
                  <p className="text-center text-lg font-semibold text-primary">{progress}% complete</p>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Please wait while we extract text from your image...
                </div>
              </div>
            ) : (
              <Textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                placeholder="Extracted text will appear here..."
                className="min-h-[200px] font-mono"
                readOnly={!extractedText}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleCopyText} 
              disabled={!extractedText || isProcessing}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDownloadText} 
              disabled={!extractedText || isProcessing}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ImageToText;
