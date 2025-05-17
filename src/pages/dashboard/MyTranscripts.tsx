
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image, FileAudio, Download, Trash2 } from "lucide-react";

// Mock transcript data
const mockTranscripts = [
  {
    id: "1",
    title: "Business Meeting Notes",
    content: "Quarterly review meeting with sales team discussing Q3 targets and projections for Q4.",
    type: "image",
    date: "2025-05-15T10:30:00",
    language: "English"
  },
  {
    id: "2",
    title: "Interview with John",
    content: "Recorded interview about product feedback and user experience suggestions.",
    type: "audio",
    date: "2025-05-14T15:45:00",
    language: "English"
  },
  {
    id: "3",
    title: "Project Requirements",
    content: "Scanned document containing project requirements and scope definition.",
    type: "image",
    date: "2025-05-10T09:15:00",
    language: "English"
  },
  {
    id: "4",
    title: "Conference Call",
    content: "Team call discussing implementation timeline and resource allocation.",
    type: "audio",
    date: "2025-05-07T11:00:00",
    language: "English"
  },
];

const MyTranscripts = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [transcripts, setTranscripts] = useState(mockTranscripts);

  const handleDelete = (id: string) => {
    setTranscripts(transcripts.filter(transcript => transcript.id !== id));
  };

  const filteredTranscripts = activeTab === "all" 
    ? transcripts 
    : transcripts.filter(transcript => transcript.type === activeTab);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Transcripts</h1>
        <p className="text-muted-foreground">View and manage your saved transcripts.</p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredTranscripts.length > 0 ? (
            <div className="space-y-4">
              {filteredTranscripts.map((transcript) => (
                <Card key={transcript.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          {transcript.type === "image" ? (
                            <Image size={16} className="text-textify-purple" />
                          ) : (
                            <FileAudio size={16} className="text-textify-purple" />
                          )}
                          {transcript.title}
                        </CardTitle>
                        <div className="flex gap-2 items-center mt-1">
                          <Badge variant="outline">
                            {transcript.type === "image" ? "Image to Text" : "Audio to Text"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(transcript.date)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Download size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="hover:text-destructive" 
                          onClick={() => handleDelete(transcript.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {transcript.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border rounded-lg bg-secondary/30">
              <p className="text-muted-foreground">
                {activeTab === "all" 
                  ? "You have no saved transcripts yet." 
                  : `You have no saved ${activeTab} transcripts yet.`
                }
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTranscripts;
