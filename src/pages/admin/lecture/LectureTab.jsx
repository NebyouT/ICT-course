import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from "@/features/api/courseApi";
import { FileText, Loader2, Upload, Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureDescription, setLectureDescription] = useState("");
  const [contentType, setContentType] = useState("video");
  const [videoFile, setVideoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [btnDisable, setBtnDisable] = useState(true);

  const params = useParams();
  const navigate = useNavigate();
  const { courseId, lectureId } = params;

  const { data: lectureData } = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.lecture;

  const [editLecture] = useEditLectureMutation();
  const [removeLecture] = useRemoveLectureMutation();

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setLectureDescription(lecture.description || "");
      setContentType(lecture.contentType || "video");
      setIsPreviewFree(lecture.isPreviewFree);
      setTextContent(lecture.textContent || "");
      setBtnDisable(false);
    }
  }, [lecture]);

  useEffect(() => {
    setBtnDisable(!lectureTitle.trim() || !lectureDescription.trim());
  }, [lectureTitle, lectureDescription]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setUploadProgress(0);
      } else {
        toast.error('Please select a video file');
        e.target.value = '';
      }
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setPdfFile(file);
        setUploadProgress(0);
      } else {
        toast.error('Please select a PDF file');
        e.target.value = '';
      }
    }
  };

  const editLectureHandler = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Please enter a lecture title");
      return;
    }

    if (!lectureDescription.trim()) {
      toast.error("Please enter a lecture description");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('lectureTitle', lectureTitle);
      formData.append('description', lectureDescription);
      formData.append('contentType', contentType);
      formData.append('isPreviewFree', isPreviewFree);

      // Add content based on type
      if (contentType === 'video' && videoFile) {
        formData.append('video', videoFile);
      } else if (contentType === 'pdf' && pdfFile) {
        formData.append('pdf', pdfFile);
      } else if (contentType === 'text') {
        formData.append('textContent', textContent);
      }

      await editLecture({
        courseId,
        lectureId,
        formData
      }).unwrap();

      toast.success('Lecture updated successfully');
      navigate(`/admin/course/${courseId}/lectures/create`);
    } catch (error) {
      console.error('Edit lecture error:', error);
      toast.error(error.data?.message || error.message || "Failed to update lecture");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeLectureHandler = async () => {
    if (!window.confirm('Are you sure you want to remove this lecture?')) {
      return;
    }

    try {
      await removeLecture(lectureId).unwrap();
      toast.success("Lecture removed successfully");
      navigate(`/admin/course/${courseId}/lectures/create`);
    } catch (error) {
      console.error('Remove error:', error);
      toast.error(error.data?.message || "Failed to remove lecture");
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update the lecture details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Lecture Title</Label>
            <Input
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="Enter lecture title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={lectureDescription}
              onChange={(e) => setLectureDescription(e.target.value)}
              placeholder="Enter lecture description"
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Lecture Content</CardTitle>
          <CardDescription>Choose the type of content for this lecture</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={contentType} onValueChange={setContentType}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Video
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="pdf" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                PDF
              </TabsTrigger>
            </TabsList>

            <TabsContent value="video" className="space-y-4">
              <div>
                <Label>Upload Video</Label>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="cursor-pointer"
                />
                {isUploading && (
                  <Progress value={uploadProgress} className="mt-2" />
                )}
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <div>
                <Label>Text Content</Label>
                <Textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Enter your text content here..."
                  className="min-h-[200px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="pdf" className="space-y-4">
              <div>
                <Label>Upload PDF</Label>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfChange}
                  className="cursor-pointer"
                />
                {isUploading && (
                  <Progress value={uploadProgress} className="mt-2" />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Preview Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Preview Settings</CardTitle>
          <CardDescription>Configure preview access for this lecture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Free Preview</Label>
              <CardDescription>
                Allow students to preview this lecture without enrollment
              </CardDescription>
            </div>
            <Switch
              checked={isPreviewFree}
              onCheckedChange={setIsPreviewFree}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="destructive"
          onClick={removeLectureHandler}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Removing...
            </>
          ) : (
            'Remove Lecture'
          )}
        </Button>

        <Button
          onClick={editLectureHandler}
          disabled={btnDisable || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Lecture'
          )}
        </Button>
      </div>
    </div>
  );
};

export default LectureTab;
