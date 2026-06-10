import { USER_ROLES, PROPOSAL_STATUSES } from "./constants";

// Mock Users
export const mockUsers = [
  {
    id: "1",
    email: "student@demo.com",
    password: "demo123",
    name: "Nguyễn Văn A",
    role: USER_ROLES.STUDENT,
    department: "Khoa CNTT",
  },
  {
    id: "2",
    email: "reviewer@demo.com",
    password: "demo123",
    name: "Trần Thị B",
    role: USER_ROLES.REVIEWER,
    department: "Khoa CNTT",
  },
  {
    id: "3",
    email: "admin@demo.com",
    password: "demo123",
    name: "Lê Văn C",
    role: USER_ROLES.ADMIN,
    department: "Ban quản trị",
  },
  {
    id: "4",
    email: "lecturer@demo.com",
    password: "demo123",
    name: "Phạm Thị D",
    role: USER_ROLES.LECTURER,
    department: "Khoa CNTT",
  },
];

// Mock Proposals
export const mockProposals = [
  {
    id: "prop-001",
    title:
      "Xây dựng hệ thống quản lý kho dữ liệu phân tán với công nghệ Blockchain",
    field: "Trí tuệ nhân tạo",
    studentName: "Nguyễn Văn A",
    studentId: "1",
    status: PROPOSAL_STATUSES.APPROVED,
    problem:
      "Hiện tại, các hệ thống quản lý kho dữ liệu tập trung gặp vấn đề về bảo mật, độ tin cậy và hiệu suất. Cần giải pháp phân tán với độ an toàn cao.",
    objectives:
      "Phát triển hệ thống quản lý kho dữ liệu sử dụng blockchain để đảm bảo tính toàn vẹn, bảo mật và phân tán dữ liệu hiệu quả.",
    methodology:
      "Sử dụng công nghệ Ethereum, smart contracts với Solidity, và IPFS để lưu trữ phân tán. Kiểm tra thông qua các bộ test unit và integration test.",
    feasibility:
      "Khả thi cao với các công nghệ mã nguồn mở có sẵn. Đội phát triển có kiến thức cơ bản về blockchain.",
    createdAt: "2026-01-15T10:30:00Z",
    updatedAt: "2026-02-20T14:45:00Z",
    aiScore: 8.5,
  },
  {
    id: "prop-002",
    title: "Ứng dụng machine learning để dự đoán khả năng bỏ học của sinh viên",
    field: "Khoa học máy tính",
    studentName: "Trần Thị E",
    studentId: "5",
    status: PROPOSAL_STATUSES.UNDER_REVIEW,
    problem:
      "Tỷ lệ bỏ học trong các trường đại học ngày càng tăng. Cần có cơ chế dự đoán sớm để can thiệp kịp thời.",
    objectives:
      "Xây dựng mô hình machine learning để dự đoán rủi ro bỏ học của sinh viên dựa trên dữ liệu học tập và hành vi.",
    methodology:
      "Thu thập dữ liệu từ hệ thống quản lý học tập, xử lý dữ liệu, huấn luyện các mô hình (Random Forest, Gradient Boosting, Neural Networks) và đánh giá.",
    feasibility:
      "Khả thi, dữ liệu có sẵn, công nghệ mature. Cần sự hỗ trợ từ bộ phận quản lý đại học.",
    createdAt: "2026-01-20T09:15:00Z",
    updatedAt: "2026-02-15T11:20:00Z",
    aiScore: 7.8,
  },
  {
    id: "prop-003",
    title: "Phát triển chatbot hỗ trợ tư vấn học tập bằng NLP",
    field: "Trí tuệ nhân tạo",
    studentName: "Lê Minh F",
    studentId: "6",
    status: PROPOSAL_STATUSES.NEEDS_REVISION,
    problem:
      "Sinh viên thiếu các nguồn tư vấn học tập 24/7. Chatbot có thể cung cấp hỗ trợ liên tục.",
    objectives:
      "Xây dựng chatbot thông minh có khả năng hiểu và trả lời các câu hỏi về học tập bằng xử lý ngôn ngữ tự nhiên.",
    methodology:
      "Sử dụng framework NLP như spaCy, BERT. Tích hợp API OpenAI hoặc HuggingFace. Huấn luyện trên tập dữ liệu Q&A học tập.",
    feasibility:
      "Khả thi, các công nghệ có sẵn, nhưng cần dataset chất lượng cao.",
    createdAt: "2026-01-10T13:45:00Z",
    updatedAt: "2026-02-10T16:30:00Z",
    aiScore: 6.9,
  },
  {
    id: "prop-004",
    title: "Hệ thống mã hóa end-to-end cho ứng dụng chat an toàn",
    field: "An toàn thông tin",
    studentName: "Phạm Văn G",
    studentId: "7",
    status: PROPOSAL_STATUSES.DRAFT,
    problem:
      "Các ứng dụng chat hiện có vẫn có rủi ro bảo mật. Cần triển khai mã hóa end-to-end mạnh mẽ.",
    objectives:
      "Phát triển ứng dụng chat với mã hóa end-to-end sử dụng Double Ratchet Algorithm và Signal Protocol.",
    methodology:
      "Sử dụng thư viện libsignal hoặc tự cài đặt Signal Protocol. Kiểm thử bảo mật và hiệu suất.",
    feasibility: "Khả thi, nhưng yêu cầu kiến thức sâu về cryptography.",
    createdAt: "2026-02-01T08:00:00Z",
    updatedAt: "2026-02-05T10:15:00Z",
    aiScore: 7.2,
  },
];

// Mock Lecturer Profiles
export const mockLecturers = [
  {
    id: "lec-001",
    name: "Phạm Thị D",
    email: "lecturer@demo.com",
    department: "Khoa CNTT",
    expertise: ["Machine Learning", "Data Science", "Python"],
    currentLoad: 2,
    maxLoad: 3,
    matchScore: 9.2,
    reason: "Chuyên gia về ML với 5 năm kinh nghiệm, phù hợp tuyệt đối.",
  },
  {
    id: "lec-002",
    name: "Trần Văn H",
    email: "tranvanh@demo.com",
    department: "Khoa CNTT",
    expertise: ["Blockchain", "Smart Contracts", "Ethereum"],
    currentLoad: 1,
    maxLoad: 3,
    matchScore: 8.8,
    reason: "Chuyên gia blockchain, có thể hướng dẫn chiều sâu về công nghệ.",
  },
  {
    id: "lec-003",
    name: "Nguyễn Thị I",
    email: "nguyenthii@demo.com",
    department: "Khoa CNTT",
    expertise: ["NLP", "AI", "Deep Learning"],
    currentLoad: 3,
    maxLoad: 3,
    matchScore: 7.9,
    reason: "Chuyên gia NLP, nhưng đã đầy công việc hướng dẫn.",
  },
  {
    id: "lec-004",
    name: "Lê Minh J",
    email: "leminh@demo.com",
    department: "Khoa CNTT",
    expertise: ["Cryptography", "Security", "Network"],
    currentLoad: 2,
    maxLoad: 3,
    matchScore: 8.5,
    reason: "Chuyên gia bảo mật, phù hợp cho đề tài mã hóa.",
  },
];

// Mock AI Feedback
export const mockAIFeedback = [
  {
    id: "fb-001",
    proposalId: "prop-001",
    timestamp: "2026-02-20T14:45:00Z",
    score: 8.5,
    strengths: [
      "Giải pháp có tính cách mạng, sử dụng công nghệ blockchain hiện đại",
      "Vấn đề được định nghĩa rõ ràng và có ứng dụng thực tiễn",
      "Phương pháp nghiên cứu khoa học, có kế hoạch kiểm thử rõ ràng",
    ],
    weaknesses: [
      "Cần làm rõ hơn về hiệu suất so sánh với giải pháp truyền thống",
      "Thiếu phân tích chi phí triển khai",
    ],
    suggestions: [
      "Thêm benchmark performance so sánh với database truyền thống",
      "Đưa ra timeline chi tiết cho từng giai đoạn phát triển",
      "Xem xét khả năng mở rộng (scalability) cho hàng triệu giao dịch",
    ],
  },
  {
    id: "fb-002",
    proposalId: "prop-002",
    timestamp: "2026-02-15T11:20:00Z",
    score: 7.8,
    strengths: [
      "Chủ đề có giá trị xã hội cao, giúp các trường giảm tỷ lệ bỏ học",
      "Dữ liệu sẵn có, khả thi triển khai cao",
    ],
    weaknesses: [
      "Cần xác định rõ các features sẽ sử dụng",
      "Thiếu thảo luận về bias trong dữ liệu",
    ],
    suggestions: [
      "Phân tích chi tiết các tính năng dự đoán (features)",
      "Địa chỉ vấn đề bias và fairness trong mô hình ML",
      "Đề xuất phương án can thiệp dựa trên dự đoán",
    ],
  },
  {
    id: "fb-003",
    proposalId: "prop-003",
    timestamp: "2026-02-10T16:30:00Z",
    score: 6.9,
    strengths: ["Ứng dụng thực tiễn cao, sinh viên sẽ hưởng lợi trực tiếp"],
    weaknesses: [
      "Phạm vi quá lớn cho một dự án sinh viên",
      "Cần giới hạn chủ đề hỏi đáp (narrowing domain)",
      "Thiếu chi tiết về kiến trúc hệ thống",
    ],
    suggestions: [
      "Giới hạn chatbot chỉ hỗ trợ một môn học hoặc lĩnh vực cụ thể",
      "Thêm sơ đồ kiến trúc hệ thống chi tiết",
      "Chuẩn bị dataset Q&A trước khi bắt đầu phát triển",
    ],
  },
];

// Mock Rubric Reviews
export const mockRubricReviews = [
  {
    id: "rubric-001",
    proposalId: "prop-001",
    reviewer: "Phạm Thị D",
    timestamp: "2026-02-20T14:45:00Z",
    criteria: [
      { name: "Tính mới lạ", score: 9, maxScore: 10 },
      { name: "Khả thi", score: 8, maxScore: 10 },
      { name: "Ứng dụng thực tế", score: 9, maxScore: 10 },
      { name: "Kỹ thuật", score: 8, maxScore: 10 },
      { name: "Trình bày", score: 8, maxScore: 10 },
    ],
    totalScore: 8.4,
    comments: "Đề tài rất tốt, khuyến nghị phê duyệt.",
  },
  {
    id: "rubric-002",
    proposalId: "prop-002",
    reviewer: "Trần Văn H",
    timestamp: "2026-02-15T11:20:00Z",
    criteria: [
      { name: "Tính mới lạ", score: 7, maxScore: 10 },
      { name: "Khả thi", score: 8, maxScore: 10 },
      { name: "Ứng dụng thực tế", score: 9, maxScore: 10 },
      { name: "Kỹ thuật", score: 7, maxScore: 10 },
      { name: "Trình bày", score: 8, maxScore: 10 },
    ],
    totalScore: 7.8,
    comments: "Tốt nhưng cần bổ sung thêm về phần kỹ thuật ML.",
  },
  {
    id: "rubric-003",
    proposalId: "prop-003",
    reviewer: "Nguyễn Thị I",
    timestamp: "2026-02-10T16:30:00Z",
    criteria: [
      { name: "Tính mới lạ", score: 6, maxScore: 10 },
      { name: "Khả thi", score: 6, maxScore: 10 },
      { name: "Ứng dụng thực tế", score: 8, maxScore: 10 },
      { name: "Kỹ thuật", score: 5, maxScore: 10 },
      { name: "Trình bày", score: 7, maxScore: 10 },
    ],
    totalScore: 6.4,
    comments:
      "Cần sửa chữa: giới hạn phạm vi, thêm chi tiết kỹ thuật, chuẩn bị dữ liệu.",
  },
];

// Mock Matching Suggestions
export const mockMatchingSuggestions = [
  {
    id: "match-001",
    proposalId: "prop-001",
    suggestedLecturers: [
      {
        lecturerId: "lec-002",
        name: "Trần Văn H",
        expertise: "Blockchain",
        matchScore: 9.2,
        reason: "Chuyên gia blockchain, phù hợp 100% với đề tài.",
      },
      {
        lecturerId: "lec-001",
        name: "Phạm Thị D",
        expertise: "Machine Learning",
        matchScore: 7.5,
        reason: "Có kinh nghiệm hệ thống phân tán, có thể hỗ trợ.",
      },
    ],
  },
  {
    id: "match-002",
    proposalId: "prop-002",
    suggestedLecturers: [
      {
        lecturerId: "lec-001",
        name: "Phạm Thị D",
        expertise: "Machine Learning",
        matchScore: 9.2,
        reason: "Chuyên gia ML, 5 năm kinh nghiệm, phù hợp tuyệt đối.",
      },
      {
        lecturerId: "lec-003",
        name: "Nguyễn Thị I",
        expertise: "AI",
        matchScore: 8.1,
        reason: "Chuyên gia AI/DL, nhưng đang bận công việc.",
      },
    ],
  },
  {
    id: "match-003",
    proposalId: "prop-003",
    suggestedLecturers: [
      {
        lecturerId: "lec-003",
        name: "Nguyễn Thị I",
        expertise: "NLP",
        matchScore: 9.1,
        reason: "Chuyên gia NLP, phù hợp tuyệt đối cho chatbot.",
      },
      {
        lecturerId: "lec-001",
        name: "Phạm Thị D",
        expertise: "Machine Learning",
        matchScore: 7.2,
        reason: "Có kinh nghiệm NLP/ML, có thể hỗ trợ.",
      },
    ],
  },
];

// Mock Milestones
export const mockMilestones = [
  {
    id: "ms-001",
    proposalId: "prop-001",
    name: "Thiết kế kiến trúc hệ thống",
    description: "Hoàn thành sơ đồ kiến trúc, chọn công nghệ, setup môi trường",
    dueDate: "2026-03-15",
    status: "completed",
    progress: 100,
  },
  {
    id: "ms-002",
    proposalId: "prop-001",
    name: "Phát triển smart contracts",
    description: "Code, test, audit smart contracts trên testnet",
    dueDate: "2026-04-30",
    status: "in-progress",
    progress: 60,
  },
  {
    id: "ms-003",
    proposalId: "prop-001",
    name: "Xây dựng frontend & integration",
    description: "Phát triển giao diện người dùng, tích hợp blockchain",
    dueDate: "2026-05-31",
    status: "not-started",
    progress: 0,
  },
  {
    id: "ms-004",
    proposalId: "prop-001",
    name: "Testing & deployment",
    description: "Kiểm thử toàn diện, triển khai mainnet",
    dueDate: "2026-06-30",
    status: "not-started",
    progress: 0,
  },
];
