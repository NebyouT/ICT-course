import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
  useGetCourseByIdQuery,
} from "@/features/api/courseApi";
import { FileText, Loader2, Upload, Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureDescription, setLectureDescription] = useState("");
  const [contentType, setContentType] = useState("video"); // video, text, pdf
  const [videoFile, setVideoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const courseId = params.courseId;

  const [createLecture, { isLoading, isSuccess, error }] = useCreateLectureMutation();
  const { data: courseData } = useGetCourseByIdQuery(courseId);
  const { data: lecturesData, refetch: refetchLectures } = useGetCourseLectureQuery(courseId);

  const supportedVideoFormats = [
    'video/mp4',
    'video/webm',
    'video/quicktime', // .mov
    'video/x-msvideo', // .avi
    'video/x-ms-wmv'   // .wmv
  ];

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (supportedVideoFormats.includes(file.type)) {
        setVideoFile(file);
        setUploadProgress(0);
      } else {
        toast.error('Unsupported video format. Please use MP4, WebM, MOV, AVI, or WMV format.');
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

  const createLectureHandler = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Please enter a lecture title");
      return;
    }

    if (!lectureDescription.trim()) {
      toast.error("Please enter a lecture description");
      return;
    }

    // Validate content based on type
    if (contentType === 'video' && !videoFile) {
      toast.error("Please select a video file");
      return;
    } else if (contentType === 'pdf' && !pdfFile) {
      toast.error("Please select a PDF file");
      return;
    } else if (contentType === 'text' && !textContent.trim()) {
      toast.error("Please enter text content");
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

      await createLecture({
        courseId,
        formData
      }).unwrap();

      toast.success('Lecture created successfully');
      resetForm();
      refetchLectures();
    } catch (error) {
      console.error('Create lecture error:', error);
      toast.error(error.data?.message || error.message || "Failed to create lecture");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setLectureTitle('');
    setLectureDescription('');
    setVideoFile(null);
    setPdfFile(null);
    setTextContent('');
    setIsPreviewFree(false);
    if (document.querySelector('input[type="file"]')) {
      document.querySelector('input[type="file"]').value = '';
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error.data?.message || "An error occurred");
    }
  }, [error]);

  return (
    <div className="flex-1 mx-10">
      {/* Course Title */}
      <div className="mb-6">
        <h1 className="font-bold text-2xl">{courseData?.course?.courseTitle}</h1>
        <p className="text-sm text-gray-500">
          Add and manage lectures for this course
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Create Lecture Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Lecture</CardTitle>
              <CardDescription>Fill in the details below to create a new lecture</CardDescription>
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
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="cursor-pointer"
                  />
                  {uploadProgress > 0 && (
                    <Progress value={uploadProgress} className="w-full" />
                  )}
                </TabsContent>

                <TabsContent value="text" className="space-y-4">
                  <Textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Enter your text content here..."
                    className="min-h-[200px]"
                  />
                </TabsContent>

                <TabsContent value="pdf" className="space-y-4">
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfChange}
                    className="cursor-pointer"
                  />
                  {uploadProgress > 0 && (
                    <Progress value={uploadProgress} className="w-full" />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Preview Toggle */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Free Preview</Label>
                  <p className="text-sm text-gray-500">
                    Make this lecture available as a free preview
                  </p>
                </div>
                <Switch
                  checked={isPreviewFree}
                  onCheckedChange={setIsPreviewFree}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            onClick={createLectureHandler}
            disabled={isLoading || isUploading}
            className="w-full"
          >
            {(isLoading || isUploading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Lecture
          </Button>
        </div>

        {/* Right Column - Lecture List */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Lectures</CardTitle>
              <CardDescription>
                {lecturesData?.lectures?.length || 0} lectures in this course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lecturesData?.lectures?.length > 0 ? (
                  lecturesData.lectures.map((lecture, index) => (
                    <Lecture
                      key={lecture._id}
                      lecture={lecture}
                      courseId={courseId}
                      index={index}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No lectures added yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
