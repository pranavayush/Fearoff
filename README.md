# FearOff Portal

A simple Student-Teacher portal built with React, TypeScript, and Tailwind CSS for easy file sharing between students and teachers.

## Features

### For Teachers
- Upload question papers (PDF or Word documents)
- View all uploaded question papers
- Delete uploaded question papers
- View metadata (subject, upload date, etc.)

### For Students
- View and download available question papers
- Upload answer sheets for specific question papers
- Track submission status
- View personal submission history

## Technology Stack

- **Frontend Framework**: React 18
- **Routing**: React Router
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Icons**: Lucide React
- **Storage**: LocalStorage (for demo purposes)

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── DashboardHeader.tsx    # Shared header component
│   ├── pages/
│   │   ├── Home.tsx               # Landing page with login options
│   │   ├── StudentLogin.tsx       # Student login page
│   │   ├── TeacherLogin.tsx       # Teacher login page
│   │   ├── StudentDashboard.tsx   # Student dashboard
│   │   ├── TeacherDashboard.tsx   # Teacher dashboard
│   │   └── NotFound.tsx           # 404 page
│   ├── utils/
│   │   ├── auth.ts                # Authentication utilities
│   │   └── storage.ts             # LocalStorage utilities
│   ├── routes.tsx                 # Route configuration
│   └── App.tsx                    # Main app component
└── styles/
    └── theme.css                  # Tailwind theme customization
```

## How to Use

### Teacher Login
1. Click "Teacher Login" on the home page
2. Enter any username and password (demo mode)
3. Upload question papers with title, subject, and file
4. View and manage uploaded papers

### Student Login
1. Click "Student Login" on the home page
2. Enter any username and password (demo mode)
3. Browse and download available question papers
4. Submit answer sheets for specific question papers
5. View submission history

## File Validation

- **Allowed file types**: PDF (.pdf), Word (.doc, .docx)
- **Maximum file size**: 5MB
- **Duplicate submission**: Students cannot submit multiple answer sheets for the same question paper

## Data Storage

This is a demo application that uses browser LocalStorage for data persistence. Data includes:
- User authentication state
- Question papers (with base64-encoded file data)
- Answer sheets (with base64-encoded file data)

**Note**: LocalStorage has size limitations (~5-10MB depending on browser). For production use, implement a proper backend with file storage.

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## Code Organization

The code is structured for beginners with:
- Clear component separation
- Utility functions for reusable logic
- TypeScript interfaces for type safety
- Simple state management with React hooks
- Clean, readable code with comments

## Future Enhancements

For a production-ready version, consider:
- Real authentication system
- Backend API with database
- File storage service (e.g., AWS S3, Supabase Storage)
- Grading and feedback system
- Email notifications
- Advanced search and filters
- File preview functionality
- Role-based permissions