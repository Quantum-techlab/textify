
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Tesseract {
  recognize: (image: File | string, options?: { logger: (info: { status: string; progress?: number }) => void }) => Promise<{ data: { text: string } }>;
}

// Define a window object that includes Tesseract
declare global {
  interface Window {
    Tesseract: Tesseract;
  }
}

const ImageToText = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState("eng");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      
      // Create an object URL for the image preview
      const objectUrl = URL.createObjectURL(selectedFile);
      setImageUrl(objectUrl);
      
      // Reset state
      setExtractedText("");
      setProgress(0);
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
    if (!image) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const result = await window.Tesseract.recognize(image, {
        logger: (info) => {
          if (info.status === "recognizing text") {
            setProgress(info.progress ? Math.round(info.progress * 100) : 0);
          }
        }
      });
      
      setExtractedText(result.data.text);
      toast({
        title: "Text extraction complete",
        description: "Your text has been successfully extracted from the image.",
      });
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        variant: "destructive",
        title: "Text extraction failed",
        description: "There was an error processing your image. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(extractedText);
    toast({
      title: "Text copied",
      description: "The extracted text has been copied to your clipboard.",
    });
  };

  const handleDownloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([extractedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "extracted-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
              disabled={!image || isProcessing}
            >
              {isProcessing ? "Processing..." : "Extract Text"}
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
                <p className="text-center text-muted-foreground">Processing image...</p>
                <Progress value={progress} className="h-2" />
                <p className="text-center text-sm">{progress}% complete</p>
              </div>
            ) : (
              <Textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                placeholder="Extracted text will appear here..."
                className="min-h-[200px] font-mono"
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
