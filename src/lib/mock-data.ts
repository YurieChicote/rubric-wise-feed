export type Rubric = {
  id: string;
  name: string;
  subject: string;
  filename: string;
  size: string;
  uploadedAt: string;
};

export type Assessment = {
  id: string;
  studentName: string;
  outputTitle: string;
  rubricId: string;
  rubricName: string;
  score: number;
  date: string;
  feedback: string;
  criteria: { name: string; score: number; max: number; comment: string }[];
  approved: boolean;
};

export const mockRubrics: Rubric[] = [
  { id: "r1", name: "Essay Rubric Q1", subject: "English 11", filename: "essay_rubric.pdf", size: "128 KB", uploadedAt: "Jun 8, 2026" },
  { id: "r2", name: "Reflection Paper", subject: "Humanities", filename: "reflection.pdf", size: "94 KB", uploadedAt: "Jun 5, 2026" },
  { id: "r3", name: "Written Report", subject: "Science 10", filename: "report_rubric.docx", size: "76 KB", uploadedAt: "May 30, 2026" },
];

export const mockAssessments: Assessment[] = [
  {
    id: "a1",
    studentName: "Juan dela Cruz",
    outputTitle: "Reflection Paper 1",
    rubricId: "r1",
    rubricName: "Essay Rubric Q1",
    score: 87,
    date: "Jun 11, 2026",
    feedback:
      "The reflection demonstrates a strong personal voice and clear thesis. Coherence between paragraphs is well-maintained, and the writer integrates relevant examples. Consider deepening the analysis of cited sources and ensuring all citations follow APA formatting consistently.",
    criteria: [
      { name: "Thesis & clarity", score: 18, max: 20, comment: "Strong, focused thesis." },
      { name: "Coherence", score: 17, max: 20, comment: "Smooth transitions throughout." },
      { name: "Evidence & citations", score: 14, max: 20, comment: "Add APA formatting to two sources." },
      { name: "Grammar & mechanics", score: 19, max: 20, comment: "Minimal errors." },
      { name: "Reflection depth", score: 19, max: 20, comment: "Insightful self-analysis." },
    ],
    approved: true,
  },
  {
    id: "a2",
    studentName: "Maria Santos",
    outputTitle: "Essay Q1",
    rubricId: "r1",
    rubricName: "Essay Rubric Q1",
    score: 74,
    date: "Jun 10, 2026",
    feedback:
      "The essay presents a clear argument but could benefit from stronger supporting evidence. Citations are present but inconsistent. Paragraph structure is solid; consider tightening the conclusion.",
    criteria: [
      { name: "Thesis & clarity", score: 15, max: 20, comment: "Clear but could be sharper." },
      { name: "Coherence", score: 15, max: 20, comment: "Mostly cohesive." },
      { name: "Evidence & citations", score: 12, max: 20, comment: "Add more primary sources." },
      { name: "Grammar & mechanics", score: 16, max: 20, comment: "A few comma splices." },
      { name: "Reflection depth", score: 16, max: 20, comment: "Develop the conclusion." },
    ],
    approved: true,
  },
  {
    id: "a3",
    studentName: "Pedro Reyes",
    outputTitle: "Written Report",
    rubricId: "r3",
    rubricName: "Written Report",
    score: 91,
    date: "Jun 9, 2026",
    feedback:
      "Excellent technical report with thorough methodology and well-organized data tables. The discussion ties findings back to the hypothesis clearly.",
    criteria: [
      { name: "Methodology", score: 19, max: 20, comment: "Rigorous and clear." },
      { name: "Data presentation", score: 18, max: 20, comment: "Well-labeled tables." },
      { name: "Discussion", score: 18, max: 20, comment: "Strong analysis." },
      { name: "Citations", score: 18, max: 20, comment: "Consistent formatting." },
      { name: "Conclusion", score: 18, max: 20, comment: "Concise and supported." },
    ],
    approved: false,
  },
];

export const teacher = {
  name: "Teacher Name",
  email: "teacher@neu.edu.ph",
  department: "Senior High School",
  school: "Senior High School · Integrated School",
  university: "New Era University",
};
