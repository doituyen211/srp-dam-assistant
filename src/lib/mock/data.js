// ───────── Mock Seed Data (Vietnamese, Realistic) ─────────

export const seedUsers = [
  {
    id: "u1",
    name: "Nguyen Van An",
    email: "an.nguyen@university.edu",
    password: "password123",
    role: "student",
    faculty: "Faculty of Information Technology",
    department: "Computer Science Dept",
    title: null,
  },
  {
    id: "u2",
    name: "Tran Thi Bich",
    email: "bich.tran@university.edu",
    password: "password123",
    role: "reviewer",
    faculty: "Faculty of Information Technology",
    department: "Computer Science Dept",
    title: null,
  },
  {
    id: "u3",
    name: "Le Van Cuong",
    email: "cuong.le@university.edu",
    password: "password123",
    role: "admin",
    faculty: "Admin",
    department: "Admin",
    title: null,
  },
  {
    id: "u4",
    name: "Pham Minh Duc",
    email: "duc.pham@university.edu",
    password: "password123",
    role: "lecturer",
    faculty: "Faculty of Information Technology",
    department: "Computer Science Dept",
    title: "Senior Lecturer",
  },
  {
    id: "u5",
    name: "System Admin",
    email: "admin@platform.com",
    password: "password123",
    role: "super_admin",
    faculty: "Admin",
    department: "Admin",
    title: null,
  },
  {
    id: "u6",
    name: "Pham Thi Mai",
    email: "mai.pham@university.edu",
    password: "password123",
    role: "student",
    faculty: "Faculty of Data Science",
    department: "Data Science Dept",
    title: null,
  },
  {
    id: "u7",
    name: "Hoang Van Em",
    email: "em.hoang@university.edu",
    password: "password123",
    role: "lecturer",
    faculty: "Faculty of Information Technology",
    department: "Computer Science Dept",
    title: "Lecturer",
  },
];

export const seedProposals = [
  {
    id: "p1",
    title: "Ung dung hoc may trong du doan diem thi sinh vien",
    abstract: "Nghien cuu xay dung mo hinh hoc may du doan ket qua thi dua tren du lieu qua trinh hoc tap cua sinh vien. Su dung thuat toan Random Forest va Neural Network de phan tich cac yeu to anh huong.",
    studentName: "Nguyen Van An",
    studentId: "u1",
    researchField: "Artificial Intelligence",
    status: "draft",
    readinessScore: 7.5,
    aiConfidence: 0.85,
    createdAt: "2026-05-15T08:00:00Z",
    updatedAt: "2026-06-10T14:30:00Z",
    keywords: ["hoc may", "du doan", "giao duc"],
    version: 3,
    nextAction: "Hoan thien muc dich nghien cuu",
    missingItems: ["Can bo sung phan dao duc nghien cuu"],
    riskFlags: ["Pham vi nghien cuu kha rong"],
    assignedReviewer: "Tran Thi Bich",
    sections: [
      { id: "title", key: "title", label: "Title", content: "Ung dung hoc may trong du doan diem thi sinh vien", health: "strong", aiComment: null, rubricHint: null },
      { id: "abstract", key: "abstract", label: "Abstract", content: "Nghien cuu xay dung mo hinh hoc may du doan ket qua thi dua tren du lieu qua trinh hoc tap cua sinh vien.", health: "strong", aiComment: null, rubricHint: null },
      { id: "problem", key: "research_problem", label: "Research Problem", content: "Hien nay, viec danh gia ket qua hoc tap cua sinh vien chu yeu dua tren cac ky thi cuoi ky, khong phan anh chinh xac qua trinh hoc tap.", health: "strong", aiComment: null, rubricHint: null },
      { id: "question", key: "research_question", label: "Research Questions", content: "Lam the nao co the su dung du lieu qua trinh hoc tap de du doan ket qua thi cua sinh vien voi do chinh xac cao?", health: "strong", aiComment: null, rubricHint: null },
      { id: "objectives", key: "objectives", label: "Objectives", content: "1. Xay dung mo hinh hoc may du doan diem thi\n2. So sanh hieu qua cac thuat toan\n3. Danh gia yeu to anh huong den ket qua", health: "needs_evidence", aiComment: null, rubricHint: null },
      { id: "literature", key: "literature_background", label: "Literature Review", content: "Cac nghien cuu truoc day ve learning analytics va educational data mining cho thay kha nang du doan ket qua hoc tap bang hoc may.", health: "needs_evidence", aiComment: null, rubricHint: null },
      { id: "methodology", key: "methodology", label: "Methodology", content: "Su dung phuong phap dinh luong, thu thap du lieu tu he thong LMS cua truong. Ap dung thuat toan Random Forest, SVM, va Neural Network.", health: "strong", aiComment: null, rubricHint: null },
      { id: "feasibility", key: "feasibility_timeline", label: "Feasibility & Timeline", content: "Du lieu san co tu he thong LMS. Thoi gian thuc hien: 6 thang. Doi ngu: 1 nghien cuu sinh + 1 huong dan.", health: "strong", aiComment: null, rubricHint: null },
      { id: "contribution", key: "expected_contribution", label: "Expected Contribution", content: "He thong du doan ket qua hoc tap co the tich hop vao LMS, giup giang vien som phat hien sinh vien co nguy co no mon.", health: "weak", aiComment: null, rubricHint: null },
      { id: "ethics", key: "ethics_risks", label: "Ethics / Risks", content: "", health: "missing", aiComment: null, rubricHint: null },
      { id: "references", key: "references", label: "References", content: "1. Baker, R. S., & Yacef, K. (2009). The State of Educational Data Mining in 2009.\n2. Romero, C., & Ventura, S. (2010). Educational data mining: A review.", health: "needs_evidence", aiComment: null, rubricHint: null },
    ],
    statusHistory: [
      { id: "sh1", to_status: "draft", from_status: null, created_at: "2026-05-15T08:00:00Z", changed_by: "Nguyen Van An" },
      { id: "sh2", to_status: "submitted", from_status: "draft", created_at: "2026-05-20T10:00:00Z", changed_by: "Nguyen Van An" },
      { id: "sh3", to_status: "under_review", from_status: "submitted", created_at: "2026-05-22T11:00:00Z", changed_by: "Tran Thi Bich" },
    ],
  },
  {
    id: "p2",
    title: "Phan tich cam xuc binh luan mang xa hoi bang NLP",
    abstract: "Nghien cuu xay dung mo hinh phan tich cam xuc cho binh luan tieng Viet tren mang xa hoi, su dung cac mo hinh transformer va ky thuat transfer learning.",
    studentName: "Nguyen Van An",
    studentId: "u1",
    researchField: "Information Security",
    status: "submitted",
    readinessScore: 6.0,
    aiConfidence: 0.7,
    createdAt: "2026-06-01T08:00:00Z",
    updatedAt: "2026-06-08T16:00:00Z",
    keywords: ["NLP", "phan tich cam xuc", "mang xa hoi"],
    version: 2,
    sections: [
      { id: "title", key: "title", label: "Title", content: "Phan tich cam xuc binh luan mang xa hoi bang NLP", health: "strong" },
      { id: "abstract", key: "abstract", label: "Abstract", content: "Nghien cuu xay dung mo hinh phan tich cam xuc cho binh luan tieng Viet tren mang xa hoi.", health: "needs_evidence" },
    ],
    statusHistory: [],
  },
  {
    id: "p3",
    title: "Xay dung he thong quan ly kho bang Blockchain",
    abstract: "Ung dung cong nghe blockchain vao quan ly chuoi cung ung, dam bao tinh minh bach va truy nguon goc san pham.",
    studentName: "Pham Thi Mai",
    studentId: "u6",
    researchField: "Information Systems",
    status: "under_review",
    readinessScore: 8.2,
    aiConfidence: 0.92,
    createdAt: "2026-04-10T08:00:00Z",
    updatedAt: "2026-06-05T09:00:00Z",
    keywords: ["blockchain", "quan ly kho", "chuoi cung ung"],
    version: 5,
    assignedLecturer: "u4",
    sections: [
      { id: "title", key: "title", label: "Title", content: "Xay dung he thong quan ly kho bang Blockchain", health: "strong" },
    ],
    statusHistory: [],
  },
  {
    id: "p4",
    title: "Trien khai Microservices cho ung dung giao truc tuyen",
    abstract: "Nghien cuu kien truc microservices phu hop cho nen tang giao duc truc tuyen, tap trung vao scalability va maintainability.",
    studentName: "Hoang Van Em",
    studentId: "u6",
    researchField: "Software Engineering",
    status: "needs_revision",
    readinessScore: 4.8,
    aiConfidence: 0.65,
    createdAt: "2026-05-20T08:00:00Z",
    updatedAt: "2026-06-12T11:00:00Z",
    keywords: ["microservices", "giao duc truc tuyen"],
    version: 2,
    sections: [
      { id: "title", key: "title", label: "Title", content: "Trien khai Microservices cho ung dung giao truc tuyen", health: "strong" },
    ],
    statusHistory: [],
  },
  {
    id: "p5",
    title: "Phat hien xam nhap an ninh mang bang Deep Learning",
    abstract: "Xay dung he thong phat hien xam nhap su dung mang no-ron sau, tap trung vao viec giam false positive.",
    studentName: "Nguyen Van An",
    studentId: "u1",
    researchField: "Information Security",
    status: "approved",
    readinessScore: 7.8,
    aiConfidence: 0.88,
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-05-15T09:00:00Z",
    keywords: ["deep learning", "an ninh mang"],
    version: 4,
    assignedReviewer: "Tran Thi Bich",
    sections: [
      { id: "title", key: "title", label: "Title", content: "Phat hien xam nhap an ninh mang bang Deep Learning", health: "strong" },
    ],
    statusHistory: [],
  },
  {
    id: "p6",
    title: "Ung dung AI trong chan doan benh tu hinh anh y te",
    abstract: "Nghien cuu su dung deep learning de phan tich hinh anh X-ray, CT scan cho ho tro chan doan.",
    studentName: "Pham Thi Mai",
    studentId: "u6",
    researchField: "Artificial Intelligence",
    status: "submitted",
    readinessScore: 7.0,
    aiConfidence: 0.78,
    createdAt: "2026-06-01T08:00:00Z",
    updatedAt: "2026-06-10T10:00:00Z",
    keywords: ["AI", "y te", "hinh anh"],
    version: 1,
    sections: [
      { id: "title", key: "title", label: "Title", content: "Ung dung AI trong chan doan benh tu hinh anh y te", health: "strong" },
    ],
    statusHistory: [],
  },
  {
    id: "p7",
    title: "Danh gia phuong phap Agile trong du an phan mem",
    abstract: "Nghien cuu so sanh hieu qua cua Scrum va Kanban trong quan ly du an phan mem giai doan.",
    studentName: "Pham Thi Mai",
    studentId: "u6",
    researchField: "Software Engineering",
    status: "draft",
    readinessScore: 5.2,
    aiConfidence: 0.6,
    createdAt: "2026-06-05T08:00:00Z",
    updatedAt: "2026-06-08T16:00:00Z",
    keywords: ["Agile", "Scrum", "Kanban"],
    version: 1,
    sections: [
      { id: "title", key: "title", label: "Title", content: "Danh gia phuong phap Agile trong du an phan mem", health: "strong" },
    ],
    statusHistory: [],
  },
  {
    id: "p8",
    title: "He thong IoT cho campus thong minh",
    abstract: "Xay dung he thong IoT quan ly nang luong va moi truong trong campus dai hoc.",
    studentName: "Nguyen Van An",
    studentId: "u1",
    researchField: "Computer Networks",
    status: "under_review",
    readinessScore: 6.5,
    aiConfidence: 0.72,
    createdAt: "2026-05-10T08:00:00Z",
    updatedAt: "2026-06-10T10:00:00Z",
    keywords: ["IoT", "smart campus"],
    version: 2,
    sections: [
      { id: "title", key: "title", label: "Title", content: "He thong IoT cho campus thong minh", health: "strong" },
    ],
    statusHistory: [],
  },
];

export const seedLecturers = [
  { id: "l1", name: "Pham Minh Duc", email: "duc.pham@university.edu", title: "Senior Lecturer", department: "Computer Science Dept", expertise: ["Artificial Intelligence", "Machine Learning", "Data Science"], currentLoad: 1, maxLoad: 3 },
  { id: "l2", name: "Nguyen Thi Hanh", email: "hanh.nguyen@university.edu", title: "Professor", department: "Computer Science Dept", expertise: ["Computer Vision", "Deep Learning"], currentLoad: 3, maxLoad: 3 },
  { id: "l3", name: "Tran Van Khoa", email: "khoa.tran@university.edu", title: "Associate Professor", department: "Engineering Dept", expertise: ["Data Analysis", "Statistics"], currentLoad: 2, maxLoad: 3 },
  { id: "l4", name: "Le Thi Mai", email: "mai.le@university.edu", title: "Lecturer", department: "Data Science Dept", expertise: ["Data Science", "Visualization"], currentLoad: 0, maxLoad: 3 },
  { id: "l5", name: "Hoang Van Em", email: "em.hoang@university.edu", title: "Senior Lecturer", department: "Computer Science Dept", expertise: ["Network Security", "Cryptography"], currentLoad: 2, maxLoad: 3 },
];

export const seedProjects = [
  { id: "pr1", title: "AI Medical Imaging System", proposalTitle: "Ung dung AI trong chan doan benh tu hinh anh y te", studentName: "Pham Thi Mai", studentId: "u6", status: "in_progress", progress: 45, supervisorName: "Pham Minh Duc", supervisor: "l1", createdAt: "2026-05-01T08:00:00Z", updatedAt: "2026-06-10T10:00:00Z" },
  { id: "pr2", title: "Education Analytics Platform", proposalTitle: "Ung dung hoc may trong du doan diem thi sinh vien", studentName: "Nguyen Van An", studentId: "u1", status: "not_started", progress: 10, supervisorName: null, supervisor: null, createdAt: "2026-06-01T08:00:00Z", updatedAt: "2026-06-10T10:00:00Z" },
  { id: "pr3", title: "Data Science Research Tool", proposalTitle: "Danh gia phuong phap Agile trong du an phan mem", studentName: "Pham Thi Mai", studentId: "u6", status: "completed", progress: 100, supervisorName: "Tran Van Khoa", supervisor: "l3", createdAt: "2026-02-01T08:00:00Z", updatedAt: "2026-06-01T10:00:00Z" },
];

export const seedFaculties = [
  { id: "f1", name: "Faculty of Information Technology" },
  { id: "f2", name: "Faculty of Electronic Engineering" },
  { id: "f3", name: "Faculty of Data Science" },
  { id: "f4", name: "Faculty of Business Administration" },
  { id: "f5", name: "Faculty of Basic Sciences" },
];

export const seedDepartments = [
  { id: "d1", name: "Computer Science Dept", facultyId: "f1" },
  { id: "d2", name: "Engineering Dept", facultyId: "f2" },
  { id: "d3", name: "Data Science Dept", facultyId: "f3" },
  { id: "d4", name: "Business Admin Dept", facultyId: "f4" },
  { id: "d5", name: "Basic Sciences Dept", facultyId: "f5" },
];

export const seedFieldsOfStudy = [
  { id: "fs1", name: "Computer Science" },
  { id: "fs2", name: "Software Engineering" },
  { id: "fs3", name: "Information Systems" },
  { id: "fs4", name: "Artificial Intelligence" },
  { id: "fs5", name: "Information Security" },
  { id: "fs6", name: "Data Science" },
  { id: "fs7", name: "Computer Networks" },
  { id: "fs8", name: "Multimedia Technology" },
];

export const seedChatSessions = [
  {
    id: "cs1",
    title: "AI in Medical Imaging",
    messages: [
      { role: "user", content: "I want to research AI in medical imaging" },
      { role: "assistant", content: "Here are suggestions based on your idea:", cards: [
        { type: "research_direction", title: "Research Direction", items: [
          { id: "d1", label: "Medical Imaging Analysis", description: "Apply deep learning to X-ray, CT scan analysis" },
          { id: "d2", label: "Clinical NLP", description: "Process clinical notes and medical records" },
          { id: "d3", label: "Disease Prediction", description: "Predict disease risk from clinical data" },
        ]},
        { type: "research_gap", title: "Research Gap", items: [
          { id: "g1", label: "Lack of small medical datasets", description: "Most research requires large labeled datasets" },
          { id: "g2", label: "Explainability in diagnosis", description: "Making AI decisions interpretable for clinicians" },
        ]},
      ]},
    ],
    createdAt: "2026-06-01T10:00:00Z",
  },
];

export const seedAuditLogs = [
  { id: "al1", timestamp: "2026-06-10T14:30:00Z", action: "AI Review", status: "success", details: "AI pre-review completed for p1", userId: "u1", userName: "Nguyen Van An" },
  { id: "al2", timestamp: "2026-06-10T10:00:00Z", action: "Submit", status: "success", details: "Proposal p2 submitted for review", userId: "u1", userName: "Nguyen Van An" },
  { id: "al3", timestamp: "2026-06-08T16:00:00Z", action: "Update", status: "success", details: "Proposal p1 section updated", userId: "u1", userName: "Nguyen Van An" },
  { id: "al4", timestamp: "2026-06-05T09:00:00Z", action: "Approve", status: "success", details: "Proposal p5 approved", userId: "u2", userName: "Tran Thi Bich" },
  { id: "al5", timestamp: "2026-06-01T08:00:00Z", action: "Create", status: "success", details: "New proposal p6 created", userId: "u6", userName: "Pham Thi Mai" },
  { id: "al6", timestamp: "2026-05-28T14:00:00Z", action: "Review", status: "success", details: "Review completed for p5", userId: "u2", userName: "Tran Thi Bich" },
  { id: "al7", timestamp: "2026-05-25T10:00:00Z", action: "Login", status: "success", details: "User u1 logged in", userId: "u1", userName: "Nguyen Van An" },
  { id: "al8", timestamp: "2026-05-20T09:00:00Z", action: "Create", status: "success", details: "New user u7 created", userId: "u3", userName: "Le Van Cuong" },
  { id: "al9", timestamp: "2026-05-15T08:00:00Z", action: "Update", status: "success", details: "System configuration updated", userId: "u3", userName: "Le Van Cuong" },
  { id: "al10", timestamp: "2026-05-10T07:00:00Z", action: "Login", status: "success", details: "User u5 logged in", userId: "u5", userName: "System Admin" },
];

export const seedProjectMembers = {
  pr1: [
    { id: "u6", name: "Pham Thi Mai", role: "Student", email: "mai.pham@university.edu", department: "Data Science Dept" },
    { id: "l1", name: "Pham Minh Duc", role: "Supervisor", email: "duc.pham@university.edu", department: "Computer Science Dept" },
  ],
  pr2: [
    { id: "u1", name: "Nguyen Van An", role: "Student", email: "an.nguyen@university.edu", department: "Computer Science Dept" },
  ],
  pr3: [
    { id: "u6", name: "Pham Thi Mai", role: "Student", email: "mai.pham@university.edu", department: "Data Science Dept" },
    { id: "l3", name: "Tran Van Khoa", role: "Supervisor", email: "khoa.tran@university.edu", department: "Engineering Dept" },
  ],
};

export const seedProjectMilestones = {
  pr1: [
    { id: "m1", title: "Literature Review", name: "Literature Review", description: "Review existing medical imaging AI research", status: "completed", progress: 100, dueDate: "2026-05-15" },
    { id: "m2", title: "Data Collection", name: "Data Collection", description: "Collect and preprocess medical imaging datasets", status: "in_progress", progress: 60, dueDate: "2026-07-01" },
    { id: "m3", title: "Model Development", name: "Model Development", description: "Develop and train deep learning models", status: "not_started", progress: 0, dueDate: "2026-08-15" },
    { id: "m4", title: "Evaluation", name: "Evaluation", description: "Evaluate model performance", status: "not_started", progress: 0, dueDate: "2026-09-01" },
    { id: "m5", title: "Final Report", name: "Final Report", description: "Write and submit final research report", status: "not_started", progress: 0, dueDate: "2026-09-15" },
  ],
  pr2: [
    { id: "m6", title: "Literature Review", name: "Literature Review", status: "not_started", progress: 0, dueDate: "2026-07-01" },
  ],
  pr3: [
    { id: "m7", title: "Literature Review", name: "Literature Review", status: "completed", progress: 100, dueDate: "2026-03-01" },
    { id: "m8", title: "Data Collection", name: "Data Collection", status: "completed", progress: 100, dueDate: "2026-04-01" },
    { id: "m9", title: "Model Development", name: "Model Development", status: "completed", progress: 100, dueDate: "2026-05-01" },
    { id: "m10", title: "Final Report", name: "Final Report", status: "completed", progress: 100, dueDate: "2026-06-01" },
  ],
};

export const seedProjectReports = {
  pr1: [
    { id: "rp1", title: "Progress Report Q2", submittedBy: "Pham Thi Mai", date: "2026-06-01", progress: "45%", downloadUrl: "#" },
  ],
  pr3: [
    { id: "rp2", title: "Final Research Report", submittedBy: "Pham Thi Mai", date: "2026-06-01", progress: "100%", downloadUrl: "#" },
    { id: "rp3", title: "Mid-term Progress Report", submittedBy: "Pham Thi Mai", date: "2026-04-15", progress: "50%", downloadUrl: "#" },
  ],
};

export const seedProjectDeliverables = {
  pr1: [],
  pr2: [],
  pr3: [
    { id: "del1", type: "paper", name: "Research Paper" },
    { id: "del2", type: "software", name: "Analysis Tool" },
  ],
};

export const seedRubricReview = {
  id: "rr1",
  proposalId: "p1",
  reviewer: "Tran Thi Bich",
  totalScore: 7.2,
  criteria: [
    { id: "problem_clarity", name: "Problem Clarity", score: 8, maxScore: 10, description: "Is the research problem clearly defined?", aiObservation: "Clear problem definition", reviewerComment: "Well-defined problem" },
    { id: "literature_grounding", name: "Literature Grounding", score: 6, maxScore: 10, description: "Is the topic grounded in theory?", aiObservation: "Needs more references", reviewerComment: "Add recent papers" },
    { id: "question_quality", name: "Research Question Quality", score: 7, maxScore: 10, description: "Are the questions specific?", aiObservation: "Questions are clear", reviewerComment: "Good research questions" },
    { id: "methodology_fit", name: "Methodology Fit", score: 8, maxScore: 10, description: "Is the methodology appropriate?", aiObservation: "Methodology fits well", reviewerComment: "Strong methodology" },
    { id: "feasibility", name: "Feasibility", score: 7, maxScore: 10, description: "Is the research feasible?", aiObservation: "Feasible with current resources", reviewerComment: "Timeline looks good" },
    { id: "contribution", name: "Expected Contribution", score: 6, maxScore: 10, description: "Does it offer new contributions?", aiObservation: "Needs clearer contribution", reviewerComment: "Clarify impact" },
    { id: "ethics_risks", name: "Ethics & Risks", score: 5, maxScore: 10, description: "Are ethical issues considered?", aiObservation: "Ethics section missing", reviewerComment: "Must add ethics section" },
    { id: "writing_quality", name: "Writing Quality", score: 8, maxScore: 10, description: "Is the writing clear?", aiObservation: "Well written", reviewerComment: "Good structure" },
  ],
  comments: "Good overall proposal. Add ethics section and clarify contribution.",
};
