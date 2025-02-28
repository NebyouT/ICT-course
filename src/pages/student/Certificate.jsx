import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetCourseDetailWithStatusQuery } from '@/features/api/purchaseApi';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import debreLogo from '@/assets/debre.png';

const Certificate = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const certificateRef = useRef(null);
  const { data: courseData, isLoading } = useGetCourseDetailWithStatusQuery(courseId);
  const { user } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!courseData?.course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Course not found</h2>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const { course } = courseData;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const downloadCertificate = async () => {
    const certificate = certificateRef.current;
    const canvas = await html2canvas(certificate, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    // Use square dimensions for PDF
    const pdfWidth = 210; // Standard square size
    const pdfHeight = 210;
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pdfWidth, pdfHeight]
    });
    
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${user.name}-${course.courseTitle}-Certificate.pdf`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Course Certificate</h1>
        <Button 
          onClick={downloadCertificate}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div
        ref={certificateRef}
        className="relative bg-white rounded-lg shadow-xl overflow-hidden aspect-square"
        style={{ 
          background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
        }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Radial Gradient Background */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: 'radial-gradient(circle at 50% 50%, #7c3aed 0%, transparent 70%)'
            }}
          ></div>

          {/* Decorative Circles */}
          <div 
            className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 opacity-10"
            style={{
              background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
              filter: 'blur(40px)'
            }}
          ></div>
          <div 
            className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 opacity-10"
            style={{
              background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
              filter: 'blur(40px)'
            }}
          ></div>

          {/* Decorative Lines */}
          <div className="absolute inset-0">
            <svg width="100%" height="100%" className="opacity-5">
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#7c3aed" strokeWidth="0.5"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Decorative Border */}
          <div className="absolute inset-[12px] border-[1px] border-purple-200 rounded-lg"></div>
          <div className="absolute inset-[16px] border-[1px] border-purple-100 rounded-lg"></div>
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-t-4 border-l-4 border-purple-600 rounded-tl-lg"></div>
          <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-purple-300 rounded-tl-lg"></div>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24">
          <div className="absolute top-0 right-0 w-full h-full border-t-4 border-r-4 border-purple-600 rounded-tr-lg"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-purple-300 rounded-tr-lg"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-24 h-24">
          <div className="absolute bottom-0 left-0 w-full h-full border-b-4 border-l-4 border-purple-600 rounded-bl-lg"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-purple-300 rounded-bl-lg"></div>
        </div>
        <div className="absolute bottom-0 right-0 w-24 h-24">
          <div className="absolute bottom-0 right-0 w-full h-full border-b-4 border-r-4 border-purple-600 rounded-br-lg"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-purple-300 rounded-br-lg"></div>
        </div>

        {/* Main Content */}
        <div className="relative p-12 text-center h-full flex flex-col justify-between">
          {/* Header with Logo */}
          <div className="mb-4">
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.1) 0%, transparent 70%)',
                  filter: 'blur(10px)'
                }}
              ></div>
              <img 
                src={debreLogo} 
                alt="University Logo" 
                className="h-20 mx-auto mb-4 relative z-10"
              />
            </div>
          </div>

          {/* Certificate Header */}
          <div className="mb-6">
            <div className="text-purple-600 font-serif italic text-lg mb-2">
              <div className="relative inline-block px-6 py-1">
                <span className="relative z-10">Excellence in Learning</span>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
              </div>
            </div>
            <div className="relative">
              <h2 className="text-4xl font-serif text-gray-800 mb-2 relative z-10">
                Certificate of Completion
              </h2>
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-3 -rotate-1 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.2), transparent)'
                }}
              ></div>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="mb-6 relative">
            <div 
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'linear-gradient(180deg, rgba(124, 58, 237, 0.05) 0%, transparent 100%)'
              }}
            ></div>
            <div className="relative p-4">
              <p className="text-gray-600 text-base mb-2">This is to certify that</p>
              <h3 className="text-2xl font-bold text-purple-600 mb-3 font-serif tracking-wide">
                {user.name}
              </h3>
              <p className="text-gray-600 text-base mb-2">
                has successfully completed the course
              </p>
              <h4 className="text-xl font-bold text-gray-800 mb-3 font-serif">
                {course.courseTitle}
              </h4>
              <p className="text-gray-600 italic text-sm">
                Awarded on {currentDate}
              </p>
            </div>
          </div>

          {/* Signature */}
          <div className="mb-6">
            <div className="text-center">
              <div className="mb-3 relative">
                <div className="font-signature text-2xl text-gray-700 mb-1">{course.creator.name}</div>
                <div className="w-40 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
              </div>
              <p className="text-gray-700 text-sm font-medium">Course Instructor</p>
            </div>
          </div>

          {/* Certificate ID and Seal */}
          <div className="flex justify-between items-end px-4">
            <div className="text-xs text-gray-500">
              Certificate ID: <span className="font-mono">{`${courseId.slice(-6)}-${user._id.slice(-6)}-${Date.now().toString().slice(-6)}`}</span>
            </div>
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-purple-200 flex items-center justify-center bg-purple-50/50 backdrop-blur-sm">
                <div className="absolute inset-0 rounded-full border-4 border-purple-100 border-dashed animate-spin-slow"></div>
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.1) 0%, transparent 70%)'
                  }}
                ></div>
                <div className="text-purple-600 font-serif text-xs text-center leading-tight z-10">
                  <div>Official</div>
                  <div>Certificate</div>
                  <div className="text-[10px] mt-0.5">✧ EST 2024 ✧</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
