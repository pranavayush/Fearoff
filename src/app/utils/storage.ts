// LocalStorage utilities for managing data

export interface QuestionPaper {
  id: string;
  title: string;
  description?: string;
  subject: string;
  fileName: string;
  fileData: string;
  uploadedBy: string;
  uploadDate: string;
}

export interface AnswerSheet {
  id: string;
  questionPaperId: string;
  questionPaperTitle: string;
  fileName: string;
  fileData: string;
  submittedBy: string;
  submissionDate: string;
  status?: 'pending' | 'evaluated';
  marks?: number;
  feedback?: string;
}

// Question Papers
export const getQuestionPapers = (): QuestionPaper[] => {
  const stored = localStorage.getItem("questionPapers");
  return stored ? JSON.parse(stored) : [];
};

export const saveQuestionPaper = (paper: QuestionPaper) => {
  const papers = getQuestionPapers();
  papers.push(paper);
  localStorage.setItem("questionPapers", JSON.stringify(papers));
};

export const deleteQuestionPaper = (id: string) => {
  const papers = getQuestionPapers();
  const filtered = papers.filter(p => p.id !== id);
  localStorage.setItem("questionPapers", JSON.stringify(filtered));
};

export const getQuestionPapersByTeacher = (teacherName: string): QuestionPaper[] => {
  return getQuestionPapers().filter(p => p.uploadedBy === teacherName);
};

// Answer Sheets
export const getAnswerSheets = (): AnswerSheet[] => {
  const stored = localStorage.getItem("answerSheets");
  return stored ? JSON.parse(stored) : [];
};

export const saveAnswerSheet = (sheet: AnswerSheet) => {
  const sheets = getAnswerSheets();
  sheets.push(sheet);
  localStorage.setItem("answerSheets", JSON.stringify(sheets));
};

export const getSubmissionsByStudent = (studentName: string): AnswerSheet[] => {
  return getAnswerSheets().filter(s => s.submittedBy === studentName);
};

export const updateAnswerSheet = (updatedSheet: AnswerSheet) => {
  const sheets = getAnswerSheets();
  const index = sheets.findIndex(s => s.id === updatedSheet.id);
  if (index !== -1) {
    sheets[index] = updatedSheet;
    localStorage.setItem("answerSheets", JSON.stringify(sheets));
  }
};

// File validation
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Please upload only PDF or Word documents" };
  }
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: "File size should not exceed 5MB" };
  }
  
  return { valid: true };
};

// Convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
