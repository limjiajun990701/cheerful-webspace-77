
import React, { useState, useEffect } from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getCurrentResume } from '@/utils/resumeData';
import { Resume } from '@/types/database';

const ResumeButton = () => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const data = await getCurrentResume();
        if (data) {
          setResume(data);
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  if (loading || !resume) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-primary">
          <FileText size={18} />
          <span className="hidden sm:inline">Resume</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <a 
            href={resume.fileUrl || resume.file_path} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex w-full cursor-pointer items-center"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View PDF
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a 
            href={resume.fileUrl || resume.file_path} 
            download={resume.fileName || resume.file_name}
            className="flex w-full cursor-pointer items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ResumeButton;
