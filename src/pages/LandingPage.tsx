
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Image, FileAudio, Upload } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();

  const handleGetStarted = () => {
    navigate("/auth/register");
  };

  const handleDemo = () => {
    // For demo purposes, automatically log in and navigate to dashboard
    login();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="text-2xl font-bold gradient-text">Textify</div>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => navigate("/auth/login")}>
            Login
          </Button>
          <Button variant="default" onClick={handleGetStarted}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 px-6 md:py-32 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Transform Media to Text in Seconds</h1>
          <p className="text-xl md:text-2xl mb-10 opacity-90">
            Extract text from images and transcribe audio files with our powerful AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="default" 
              className="bg-white text-textify-purple hover:bg-gray-100"
              onClick={handleGetStarted}
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white/20 border-2 border-white text-white hover:bg-white/30"
              onClick={handleDemo}
            >
              Try Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features Made Simple</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md card-hover">
              <div className="h-12 w-12 bg-textify-purple/10 rounded-lg flex items-center justify-center mb-4">
                <Image size={24} className="text-textify-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Image to Text</h3>
              <p className="text-gray-600">
                Upload images and our OCR technology will extract text with high accuracy.
              </p>
            </div>
            
            {/* Feature Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md card-hover">
              <div className="h-12 w-12 bg-textify-purple/10 rounded-lg flex items-center justify-center mb-4">
                <FileAudio size={24} className="text-textify-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Audio Transcription</h3>
              <p className="text-gray-600">
                Convert audio files to text transcripts with our advanced speech-to-text technology.
              </p>
            </div>
            
            {/* Feature Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md card-hover">
              <div className="h-12 w-12 bg-textify-purple/10 rounded-lg flex items-center justify-center mb-4">
                <Upload size={24} className="text-textify-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Drag & Drop</h3>
              <p className="text-gray-600">
                Simply drag and drop files for a seamless upload experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg mb-8 text-gray-600">
            Join thousands of users who are already extracting text from images and audio files.
          </p>
          <Button 
            size="lg" 
            variant="default"
            onClick={handleGetStarted}
            className="bg-textify-purple hover:bg-textify-purple-dark"
          >
            Start For Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 px-6 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-xl font-bold gradient-text mb-4 md:mb-0">Textify</div>
          <div className="text-sm text-gray-500">© 2025 Textify. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
