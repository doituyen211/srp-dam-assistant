import { USER_ROLES, PROPOSAL_STATUSES } from "./constants";

// ═══════════════════════════════════════════
// 1. USERS
// ═══════════════════════════════════════════
export const mockUsers = [
  {
    id: "1",
    email: "student@demo.com",
    password: "demo123",
    name: "Nguyễn Văn A",
    role: USER_ROLES.STUDENT,
    faculty: "Khoa Công nghệ Thông tin",
    department: "Khoa CNTT",
    studentId: "SV2021001",
    year: 3,
  },
  {
    id: "2",
    email: "reviewer@demo.com",
    password: "demo123",
    name: "Trần Thị B",
    role: USER_ROLES.REVIEWER,
    title: "Phó Giáo sư",
    faculty: "Khoa Công nghệ Thông tin",
    department: "Khoa CNTT",
  },
  {
    id: "3",
    email: "admin@demo.com",
    password: "demo123",
    name: "Lê Văn C",
    role: USER_ROLES.ADMIN,
    title: "Giảng viên chính",
    department: "Ban quản trị",
  },
  {
    id: "4",
    email: "lecturer@demo.com",
    password: "demo123",
    name: "Phạm Thị D",
    role: USER_ROLES.LECTURER,
    title: "Giảng viên chính",
    faculty: "Khoa Công nghệ Thông tin",
    department: "Khoa CNTT",
  },
  {
    id: "5",
    email: "student2@demo.com",
    password: "demo123",
    name: "Trần Thị E",
    role: USER_ROLES.STUDENT,
    faculty: "Khoa Công nghệ Thông tin",
    department: "Khoa CNTT",
    studentId: "SV2021002",
    year: 4,
  },
  {
    id: "6",
    email: "student3@demo.com",
    password: "demo123",
    name: "Lê Minh F",
    role: USER_ROLES.STUDENT,
    faculty: "Khoa Công nghệ Thông tin",
    department: "Khoa CNTT",
    studentId: "SV2021003",
    year: 3,
  },
  {
    id: "7",
    email: "superadmin@srpplatform.com",
    password: "password123",
    name: "Platform Admin",
    role: USER_ROLES.SUPER_ADMIN,
    title: "Super Administrator",
  },
];

// ═══════════════════════════════════════════
// 2. PROPOSAL SECTION HELPERS
// ═══════════════════════════════════════════

function makeSections(opts) {
  const {
    abstract = "",
    problem = "",
    question = "",
    objectives = "",
    literature = "",
    methodology = "",
    feasibility = "",
    contribution = "",
    ethics = "",
    references = "",
    abstractHealth = "strong",
    problemHealth = "strong",
    questionHealth = "strong",
    objectivesHealth = "strong",
    literatureHealth = "needs_evidence",
    methodologyHealth = "strong",
    feasibilityHealth = "strong",
    contributionHealth = "needs_evidence",
    ethicsHealth = "weak",
    referencesHealth = "needs_evidence",
  } = opts;

  return [
    {
      id: "abstract",
      label: "Tóm tắt / Synopsis",
      content: abstract,
      health: abstractHealth,
      aiComment:
        abstractHealth === "strong"
          ? "Tóm tắt rõ ràng, đủ thông tin."
          : abstractHealth === "needs_evidence"
            ? "Cần thêm chi tiết về phương pháp."
            : "Tóm tắt quá ngắn, cần mở rộng.",
      rubricHint:
        "Kiểm tra tính đầy đủ: vấn đề - phương pháp - kết quả kỳ vọng.",
    },
    {
      id: "problem",
      label: "Vấn đề nghiên cứu",
      content: problem,
      health: problemHealth,
      aiComment:
        problemHealth === "strong"
          ? "Vấn đề được định nghĩa tốt, có bối cảnh và khoảng trống."
          : problemHealth === "needs_evidence"
            ? "Cần dẫn chứng cụ thể hơn về khoảng trống nghiên cứu."
            : "Vấn đề chưa rõ ràng, cần tái cấu trúc.",
      rubricHint:
        "Vấn đề có thực sự cần giải quyết? Có dẫn chứng từ thực tiễn?",
    },
    {
      id: "question",
      label: "Câu hỏi nghiên cứu",
      content: question,
      health: questionHealth,
      aiComment:
        questionHealth === "strong"
          ? "Câu hỏi nghiên cứu cụ thể, có thể đo lường."
          : questionHealth === "needs_evidence"
            ? "Câu hỏi nên được chia nhỏ thành các câu hỏi phụ."
            : "Thiếu câu hỏi nghiên cứu rõ ràng.",
      rubricHint: "Câu hỏi có thể trả lời được bằng phương pháp đề xuất?",
    },
    {
      id: "objectives",
      label: "Mục tiêu",
      content: objectives,
      health: objectivesHealth,
      aiComment:
        objectivesHealth === "strong"
          ? "Mục tiêu cụ thể, đo lường được, khả thi."
          : objectivesHealth === "needs_evidence"
            ? "Nên bổ sung chỉ số đánh giá cho mỗi mục tiêu."
            : "Mục tiêu còn chung chung.",
      rubricHint: "Mỗi mục tiêu có thể kiểm chứng được không?",
    },
    {
      id: "literature",
      label: "Cơ sở lý thuyết",
      content: literature,
      health: literatureHealth,
      aiComment:
        literatureHealth === "strong"
          ? "Tài liệu tham khảo phong phú, có phân tích phản biện."
          : literatureHealth === "needs_evidence"
            ? "Nên bổ sung thêm các công trình gần đây (5 năm)."
            : "Cần mở rộng tổng quan tài liệu.",
      rubricHint: "Có tài liệu cập nhật? Có chỉ ra khoảng trống?",
    },
    {
      id: "methodology",
      label: "Phương pháp nghiên cứu",
      content: methodology,
      health: methodologyHealth,
      aiComment:
        methodologyHealth === "strong"
          ? "Phương pháp phù hợp, có kế hoạch chi tiết."
          : methodologyHealth === "needs_evidence"
            ? "Cần mô tả cách thu thập và xử lý dữ liệu cụ thể hơn."
            : "Phương pháp chưa được mô tả đầy đủ.",
      rubricHint: "Phương pháp có phù hợp với câu hỏi nghiên cứu?",
    },
    {
      id: "feasibility",
      label: "Tính khả thi & tiến độ",
      content: feasibility,
      health: feasibilityHealth,
      aiComment:
        feasibilityHealth === "strong"
          ? "Kế hoạch khả thi, có phân bổ thời gian hợp lý."
          : feasibilityHealth === "needs_evidence"
            ? "Nên bổ sung timeline chi tiết theo tuần."
            : "Tiến độ chưa thực tế.",
      rubricHint: "Nguồn lực có đủ? Thời gian có hợp lý?",
    },
    {
      id: "contribution",
      label: "Đóng góp dự kiến",
      content: contribution,
      health: contributionHealth,
      aiComment:
        contributionHealth === "strong"
          ? "Đóng góp rõ ràng, có giá trị học thuật và thực tiễn."
          : contributionHealth === "needs_evidence"
            ? "Nên định lượng tác động dự kiến."
            : "Đóng góp còn chung chung.",
      rubricHint: "Đóng góp có mới và có ý nghĩa không?",
    },
    {
      id: "ethics",
      label: "Đạo đức & Rủi ro",
      content: ethics,
      health: ethicsHealth,
      aiComment:
        ethicsHealth === "strong"
          ? "Đã xem xét đầy đủ các vấn đề đạo đức."
          : ethicsHealth === "needs_evidence"
            ? "Cần đề cập đến quyền riêng tư và bảo mật dữ liệu."
            : "Thiếu phân tích về đạo đức nghiên cứu.",
      rubricHint: "Nếu có dữ liệu cá nhân, đã xin phép chưa?",
    },
    {
      id: "references",
      label: "Tài liệu tham khảo",
      content: references,
      health: referencesHealth,
      aiComment:
        referencesHealth === "strong"
          ? "Danh mục phong phú, đúng chuẩn trích dẫn."
          : referencesHealth === "needs_evidence"
            ? "Nên bổ sung tài liệu tiếng Anh và bài báo Q1."
            : "Danh mục còn thiếu, cần chuẩn hóa định dạng.",
      rubricHint: "Đủ số lượng? Đúng định dạng? Có tài liệu cập nhật?",
    },
  ];
}

// ═══════════════════════════════════════════
// 3. PROPOSALS (6 proposals across the workflow)
// ═══════════════════════════════════════════
export const mockProposals = [
  {
    id: "prop-001",
    title:
      "Xây dựng hệ thống quản lý kho dữ liệu phân tán với công nghệ Blockchain",
    abstract:
      "Đề xuất xây dựng hệ thống quản lý kho dữ liệu phân tán sử dụng blockchain Ethereum và IPFS nhằm giải quyết các vấn đề về bảo mật, độ tin cậy và hiệu suất của các hệ thống tập trung hiện tại. Hệ thống sử dụng smart contracts để đảm bảo tính toàn vẹn dữ liệu.",
    studentName: "Nguyễn Văn A",
    studentId: "1",
    faculty: "Khoa Công nghệ Thông tin",
    department: "Khoa CNTT",
    researchField: "Trí tuệ nhân tạo",
    keywords: ["Blockchain", "Distributed Storage", "IPFS", "Smart Contracts"],
    status: PROPOSAL_STATUSES.APPROVED,
    currentStage: 5,
    readinessScore: 8.5,
    aiConfidence: 0.87,
    createdAt: "2026-01-15T10:30:00Z",
    updatedAt: "2026-02-20T14:45:00Z",
    submittedAt: "2026-01-20T08:00:00Z",
    deadline: "2026-06-30T23:59:59Z",
    assignedReviewer: null,
    assignedLecturer: null,
    nextAction: "Phân công giảng viên hướng dẫn",
    missingItems: ["Ethics clearance"],
    riskFlags: ["scope_too_broad"],
    version: 3,
    sections: makeSections({
      abstract:
        "Đề xuất xây dựng hệ thống quản lý kho dữ liệu phân tán sử dụng blockchain Ethereum và IPFS nhằm giải quyết các vấn đề về bảo mật, độ tin cậy và hiệu suất của các hệ thống tập trung hiện tại. Hệ thống sử dụng smart contracts để đảm bảo tính toàn vẹn dữ liệu và cung cấp cơ chế đồng thuận phi tập trung. Kết quả dự kiến là một prototype có thể xử lý 10.000 giao dịch/giây với độ trễ dưới 2 giây.",
      problem:
        "Các hệ thống quản lý kho dữ liệu tập trung hiện nay đối mặt với ba thách thức lớn: (1) bảo mật — dữ liệu tập trung là mục tiêu tấn công hấp dẫn, (2) độ tin cậy — một điểm lỗi duy nhất có thể làm sụp đổ toàn bộ hệ thống, (3) hiệu suất — chi phí vận hành trung tâm dữ liệu lớn tăng theo cấp số nhân. Công nghệ blockchain với cơ chế đồng thuận phân tán hứa hẹn giải quyết đồng thời cả ba vấn đề.",
      question:
        "1. Làm thế nào để thiết kế hệ thống lưu trữ phân tán đảm bảo tính nhất quán và hiệu suất? 2. Smart contracts có thể tự động hóa việc kiểm tra tính toàn vẹn dữ liệu như thế nào? 3. Hiệu suất của hệ thống đề xuất so với giải pháp tập trung truyền thống ra sao?",
      objectives:
        "1. Thiết kế kiến trúc hệ thống kho dữ liệu phân tán dựa trên blockchain. 2. Xây dựng smart contract cho cơ chế đồng thuận và kiểm tra toàn vẹn. 3. Tích hợp IPFS cho lưu trữ phi tập trung. 4. Đánh giá hiệu suất thông qua benchmark với 10.000+ giao dịch.",
      literature:
        "Các nghiên cứu gần đây (Nakamoto 2008, Wood 2014, Benet 2017) đã đặt nền móng cho blockchain và IPFS. Tuy nhiên, hầu hết các giải pháp hiện tại tập trung vào tài chính (DeFi) hơn là lưu trữ dữ liệu học thuật. Công trình của Chen et al. (2024) trên IEEE Access đề xuất một mô hình lai nhưng chưa giải quyết được bài toán hiệu suất ở quy mô lớn.",
      methodology:
        "Nghiên cứu sử dụng phương pháp thiết kế và thực nghiệm (design science research). Giai đoạn 1: Phân tích yêu cầu và thiết kế kiến trúc. Giai đoạn 2: Phát triển smart contract bằng Solidity, triển khai trên Ethereum testnet. Giai đoạn 3: Tích hợp IPFS và xây dựng API. Giai đoạn 4: Đo lường hiệu suất (throughput, latency, cost) so với MongoDB và PostgreSQL.",
      feasibility:
        "Khả thi cao. Công nghệ mã nguồn mở (Ethereum, IPFS) đã trưởng thành. Đội phát triển có kiến thức cơ bản về blockchain. Dự kiến hoàn thành trong 14 tuần với 3 milestone chính. Rủi ro chính là chi phí gas trên Ethereum mainnet — giải pháp là sử dụng testnet và L2 solutions.",
      contribution:
        "1. Một kiến trúc tham chiếu cho hệ thống lưu trữ học thuật phân tán. 2. Bộ smart contracts mã nguồn mở cho quản lý dữ liệu phi tập trung. 3. Dữ liệu benchmark so sánh hiệu suất với giải pháp truyền thống. 4. Bài báo khoa học cho hội thảo chuyên ngành.",
      ethics:
        "Dữ liệu sử dụng là dữ liệu tổng hợp (synthetic data), không chứa thông tin cá nhân. Hệ thống tuân thủ nguyên tắc bảo vệ dữ liệu (GDPR).",
      references:
        "1. Nakamoto, S. (2008). Bitcoin: A Peer-to-Peer Electronic Cash System. 2. Wood, G. (2014). Ethereum: A Secure Decentralised Generalised Transaction Ledger. 3. Benet, J. (2017). IPFS - Content Addressed, Versioned, P2P File System. 4. Chen et al. (2024). Blockchain-based Distributed Storage. IEEE Access.",
    }),
  },
  {
    id: "prop-002",
    title: "Ứng dụng machine learning để dự đoán khả năng bỏ học của sinh viên",
    abstract:
      "Nghiên cứu xây dựng mô hình machine learning dự đoán rủi ro bỏ học của sinh viên đại học dựa trên dữ liệu học tập và hành vi. Sử dụng các thuật toán Random Forest, XGBoost và Neural Networks để phân tích dữ liệu từ hệ thống quản lý học tập.",
    studentName: "Trần Thị E",
    studentId: "5",
    faculty: "Khoa Công nghệ Thông tin",
    department: "Khoa CNTT",
    researchField: "Khoa học máy tính",
    keywords: [
      "Machine Learning",
      "Student Dropout",
      "Predictive Model",
      "Educational Data Mining",
    ],
    status: PROPOSAL_STATUSES.UNDER_REVIEW,
    currentStage: 3,
    readinessScore: 7.8,
    aiConfidence: 0.82,
    createdAt: "2026-01-20T09:15:00Z",
    updatedAt: "2026-02-15T11:20:00Z",
    submittedAt: "2026-02-01T10:00:00Z",
    deadline: "2026-07-15T23:59:59Z",
    assignedReviewer: "2",
    assignedLecturer: null,
    nextAction: "Reviewer đánh giá",
    missingItems: ["Data access approval"],
    riskFlags: ["missing_data"],
    version: 2,
    sections: makeSections({
      abstract:
        "Tỷ lệ bỏ học đại học tại Việt Nam dao động 10-15%, gây lãng phí nguồn lực xã hội. Nghiên cứu này đề xuất xây dựng mô hình ML dự đoán rủi ro bỏ học dựa trên dữ liệu LMS (Learning Management System), kết quả học tập và thông tin nhân khẩu học. Mục tiêu đạt độ chính xác trên 85%.",
      problem:
        "Tỷ lệ bỏ học tại các trường đại học Việt Nam đang ở mức báo động (12% theo Bộ GD&ĐT 2025). Các phương pháp can thiệp hiện tại chỉ dựa trên cảm tính của cố vấn học tập, thiếu cơ sở dữ liệu định lượng. Cần một hệ thống cảnh báo sớm dựa trên dữ liệu.",
      question:
        "1. Những yếu tố nào có khả năng dự đoán rủi ro bỏ học nhất? 2. Mô hình ML nào cho hiệu suất tốt nhất trên dữ liệu giáo dục? 3. Làm thế nào để triển khai hệ thống cảnh báo theo thời gian thực?",
      objectives:
        "1. Xác định các feature quan trọng từ dữ liệu LMS. 2. Huấn luyện và so sánh 3 thuật toán (RF, XGBoost, DNN). 3. Xây dựng pipeline xử lý dữ liệu tự động. 4. Tích hợp cảnh báo real-time qua dashboard.",
      literature:
        "Sinh viên bỏ học là chủ đề được nghiên cứu rộng rãi (Tinto 1975, Bean 1980). Các nghiên cứu gần đây sử dụng ML (Shahiri 2015, Amrieh 2016) cho thấy tiềm năng của dữ liệu LMS. Tuy nhiên, hầu hết tập trung vào dữ liệu phương Tây — chưa có mô hình phù hợp cho bối cảnh Việt Nam.",
      methodology:
        "Sử dụng CRISP-DM framework. Thu thập dữ liệu từ Moodle LMS của trường (5 năm, ~10,000 sinh viên). Tiền xử lý: xử lý missing value, encoding, scaling. Huấn luyện: train/test split 80/20, cross-validation 5-fold. Đánh giá: accuracy, precision, recall, F1, AUC-ROC.",
      feasibility:
        "Dữ liệu đã có sẵn từ phòng đào tạo. Công nghệ ML đã trưởng thành (scikit-learn, TensorFlow). Thời gian 14 tuần. Rủi ro: chất lượng dữ liệu không đồng đều — cần làm sạch dữ liệu kỹ lưỡng.",
      contribution:
        "1. Bộ dữ liệu giáo dục mở cho cộng đồng nghiên cứu. 2. Mô hình dự đoán tối ưu cho bối cảnh Việt Nam. 3. Hệ thống dashboard cảnh báo sớm có thể triển khai thực tế. 4. Bài báo hội thảo quốc gia.",
      ethics:
        "Dữ liệu sẽ được ẩn danh hóa. Nghiên cứu tuân thủ quy định bảo vệ dữ liệu của trường. Cần xin phép hội đồng đạo đức nghiên cứu.",
      references:
        "1. Tinto, V. (1975). Dropout from Higher Education. Review of Educational Research. 2. Shahiri, A.M. (2015). A Review on Predicting Student's Performance. 3. Amrieh, E.A. (2016). Mining Educational Data to Predict Student's academic Performance.",
      literatureHealth: "needs_evidence",
      ethicsHealth: "needs_evidence",
    }),
  },
  {
    id: "prop-003",
    title:
      "Phát triển chatbot hỗ trợ tư vấn học tập bằng xử lý ngôn ngữ tự nhiên",
    abstract:
      "Phát triển chatbot thông minh sử dụng NLP và mô hình ngôn ngữ lớn để hỗ trợ sinh viên trong việc tra cứu thông tin học tập, lịch học, và giải đáp thắc mắc về chương trình đào tạo.",
    studentName: "Lê Minh F",
    studentId: "6",
    faculty: "Khoa Công nghệ Thông tin",
    department: "Khoa CNTT",
    researchField: "Trí tuệ nhân tạo",
    keywords: [
      "Chatbot",
      "NLP",
      "Educational Technology",
      "Question Answering",
    ],
    status: PROPOSAL_STATUSES.NEEDS_REVISION,
    currentStage: 5,
    readinessScore: 6.5,
    aiConfidence: 0.73,
    createdAt: "2026-01-10T13:45:00Z",
    updatedAt: "2026-02-10T16:30:00Z",
    submittedAt: "2026-01-25T09:00:00Z",
    deadline: "2026-05-30T23:59:59Z",
    assignedReviewer: "2",
    assignedLecturer: null,
    nextAction: "Sinh viên chỉnh sửa theo yêu cầu",
    missingItems: ["Domain-specific dataset", "System architecture diagram"],
    riskFlags: ["scope_too_broad", "weak_methodology"],
    version: 1,
    sections: makeSections({
      abstract:
        "Chatbot giáo dục đang trở thành xu hướng, nhưng hầu hết là các chatbot tổng quát chưa được tối ưu cho môi trường đại học. Đề tài xây dựng chatbot chuyên biệt cho tư vấn học tập, sử dụng NLP và fine-tune mô hình ngôn ngữ lớn.",
      problem:
        "Sinh viên thường gặp khó khăn trong việc tìm kiếm thông tin học tập chính xác. Phòng đào tạo quá tải với hàng trăm câu hỏi mỗi ngày. Chatbot hiện tại của trường chỉ trả lời được các câu hỏi đơn giản, thiếu khả năng hiểu ngữ cảnh.",
      question:
        "1. Làm thế nào để xây dựng chatbot hiểu được ngữ cảnh học tập đại học? 2. Mô hình NLP nào phù hợp nhất cho tiếng Việt trong lĩnh vực giáo dục? 3. Chatbot có thể đạt độ chính xác bao nhiêu %?",
      objectives:
        "Xây dựng chatbot thông minh có khả năng hiểu và trả lời các câu hỏi về học tập.",
      literature:
        "Các nghiên cứu về chatbot giáo dục (Winkler 2018, Okonkwo 2021) cho thấy tiềm năng lớn trong việc giảm tải cho nhân viên. Tuy nhiên, các giải pháp hiện tại chủ yếu bằng tiếng Anh.",
      methodology:
        "Sử dụng framework NLP như spaCy, BERT. Tích hợp API OpenAI.",
      feasibility: "Khả thi, nhưng cần dataset chất lượng cao về Q&A học tập.",
      contribution:
        "Chatbot hỗ trợ sinh viên 24/7, giảm tải cho phòng đào tạo.",
      ethics: "",
      references:
        "1. Winkler, R. (2018). Chatbots in Education. 2. Okonkwo, C.W. (2021). Chatbot in Higher Education.",
      abstractHealth: "needs_evidence",
      problemHealth: "needs_evidence",
      questionHealth: "weak",
      objectivesHealth: "weak",
      literatureHealth: "weak",
      methodologyHealth: "weak",
      feasibilityHealth: "weak",
      contributionHealth: "weak",
      ethicsHealth: "missing",
      referencesHealth: "weak",
    }),
  },
  {
    id: "prop-004",
    title: "Hệ thống mã hóa end-to-end cho ứng dụng chat an toàn",
    abstract:
      "Phát triển ứng dụng chat với mã hóa end-to-end sử dụng Double Ratchet Algorithm và Signal Protocol, đảm bảo quyền riêng tư và bảo mật cho người dùng trong môi trường doanh nghiệp.",
    studentName: "Phạm Văn G",
    studentId: "7",
    faculty: "Khoa Công nghệ Thông tin",
    department: "Khoa CNTT",
    researchField: "An toàn thông tin",
    keywords: [
      "End-to-End Encryption",
      "Signal Protocol",
      "Double Ratchet",
      "Secure Messaging",
    ],
    status: PROPOSAL_STATUSES.DRAFT,
    currentStage: 1,
    readinessScore: 6.8,
    aiConfidence: 0.65,
    createdAt: "2026-02-01T08:00:00Z",
    updatedAt: "2026-02-05T10:15:00Z",
    submittedAt: null,
    deadline: "2026-08-31T23:59:59Z",
    assignedReviewer: null,
    assignedLecturer: null,
    nextAction: "Hoàn thiện đề cương và chạy AI Pre-check",
    missingItems: ["Research question", "Literature review", "Methodology"],
    riskFlags: ["timeline_unrealistic"],
    version: 1,
    sections: makeSections({
      abstract: "Phát triển ứng dụng chat an toàn sử dụng mã hóa end-to-end.",
      problem:
        "Các ứng dụng chat hiện có vẫn có rủi ro bảo mật. Cần triển khai mã hóa end-to-end mạnh mẽ.",
      question: "",
      objectives: "Phát triển ứng dụng chat với mã hóa end-to-end.",
      literature: "",
      methodology: "Sử dụng thư viện libsignal.",
      feasibility: "Khả thi, nhưng yêu cầu kiến thức sâu về cryptography.",
      contribution: "",
      ethics: "",
      references: "",
      abstractHealth: "needs_evidence",
      problemHealth: "needs_evidence",
      questionHealth: "missing",
      objectivesHealth: "weak",
      literatureHealth: "missing",
      methodologyHealth: "weak",
      feasibilityHealth: "weak",
      contributionHealth: "missing",
      ethicsHealth: "missing",
      referencesHealth: "missing",
    }),
  },
  {
    id: "prop-005",
    title:
      "Phân tích sentiment đa phương thức cho đánh giá sản phẩm thương mại điện tử",
    abstract:
      "Nghiên cứu phương pháp phân tích sentiment kết hợp văn bản và hình ảnh từ đánh giá sản phẩm trên các nền tảng thương mại điện tử, sử dụng mô hình đa phương thức (multimodal) deep learning.",
    studentName: "Trần Thị E",
    studentId: "5",
    faculty: "Khoa Công nghệ Thông tin",
    department: "Khoa CNTT",
    researchField: "Trí tuệ nhân tạo",
    keywords: [
      "Sentiment Analysis",
      "Multimodal Learning",
      "Deep Learning",
      "E-commerce",
    ],
    status: PROPOSAL_STATUSES.AI_PRE_CHECK,
    currentStage: 2,
    readinessScore: 7.0,
    aiConfidence: 0.78,
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-03-10T14:00:00Z",
    submittedAt: null,
    deadline: "2026-09-30T23:59:59Z",
    assignedReviewer: null,
    assignedLecturer: null,
    nextAction: "Chạy AI Pre-check và chỉnh sửa trước khi gửi",
    missingItems: ["Ethics consideration", "Data sources"],
    riskFlags: ["scope_too_broad"],
    version: 1,
    sections: makeSections({
      abstract:
        "Phân tích sentiment đa phương thức kết hợp text và image từ đánh giá sản phẩm Shopee/Tiki, sử dụng mô hình CLIP và BERT để tăng độ chính xác.",
      problem:
        "Phân tích sentiment truyền thống chỉ dựa trên văn bản, bỏ qua thông tin từ hình ảnh sản phẩm — nơi chứa nhiều tín hiệu quan trọng về chất lượng và trải nghiệm thực tế.",
      question:
        "1. Mô hình đa phương thức nào cho hiệu suất tốt nhất trên dữ liệu tiếng Việt? 2. Image sentiment có cải thiện accuracy so với text-only không? 3. Làm thế nào để align text và image features?",
      objectives:
        "1. Xây dựng dataset đa phương thức từ TMĐT. 2. Phát triển mô hình fusion text-image. 3. So sánh với baseline text-only. 4. Đạt accuracy > 85%.",
      literature:
        "Phân tích sentiment đa phương thức là hướng nghiên cứu mới (Xu 2023, Zhang 2024). Các mô hình CLIP (Radford 2021) và ViLT (Kim 2021) cho thấy tiềm năng. Tuy nhiên, chưa có nghiên cứu cho tiếng Việt.",
      methodology:
        "Thu thập 10,000 đánh giá từ Shopee/Tiki. Sử dụng CLIP cho image features, PhoBERT cho text features. Fusion bằng attention mechanism. Đánh giá bằng accuracy, F1.",
      feasibility:
        "Dữ liệu có thể thu thập qua API. Cần GPU cho training. Thời gian 14 tuần. Rủi ro: chi phí GPU.",
      contribution:
        "1. Dataset đa phương thức tiếng Việt đầu tiên. 2. Mô hình baseline cho sentiment analysis đa phương thức tiếng Việt.",
      ethics: "Dữ liệu công khai, không chứa thông tin cá nhân.",
      references:
        "1. Radford, A. (2021). Learning Transferable Visual Models From Natural Language Supervision. 2. Kim, W. (2021). ViLT: Vision-and-Language Transformer.",
      ethicsHealth: "strong",
      methodologyHealth: "needs_evidence",
    }),
  },
  {
    id: "prop-006",
    title: "Phát hiện tấn công mạng sử dụng học sâu trên dữ liệu dòng mạng",
    abstract:
      "Xây dựng hệ thống phát hiện tấn công mạng thời gian thực sử dụng deep learning (LSTM, Transformer) trên dữ liệu dòng mạng (network flows) từ môi trường doanh nghiệp.",
    studentName: "Nguyễn Văn A",
    studentId: "1",
    faculty: "Khoa Công nghệ Thông tin",
    department: "Khoa CNTT",
    researchField: "An toàn thông tin",
    keywords: [
      "Network Security",
      "Deep Learning",
      "LSTM",
      "Anomaly Detection",
    ],
    status: PROPOSAL_STATUSES.COMPLETED,
    currentStage: 10,
    readinessScore: 9.0,
    aiConfidence: 0.92,
    createdAt: "2026-01-15T10:30:00Z",
    updatedAt: "2026-03-20T16:00:00Z",
    submittedAt: "2026-01-20T08:00:00Z",
    deadline: "2026-06-30T23:59:59Z",
    assignedReviewer: "2",
    assignedLecturer: "4",
    nextAction: "Hoàn thành — kết quả đã được nghiệm thu",
    missingItems: [],
    riskFlags: [],
    version: 3,
    sections: makeSections({
      abstract:
        "Hệ thống phát hiện tấn công mạng sử dụng LSTM và Transformer trên bộ dữ liệu CIC-IDS2017 và CSE-CIC-IDS2018. Đạt F1-score 97.2% trên tập kiểm tra, giảm 23% false alarm so với phương pháp truyền thống.",
      problem:
        "Các hệ thống phát hiện xâm nhập (IDS) truyền thống dựa trên signature không thể phát hiện tấn công zero-day. Học sâu cho phép phát hiện bất thường dựa trên hành vi thay vì chữ ký cố định.",
      question:
        "1. Kiến trúc deep learning nào cho hiệu suất phát hiện tấn công tốt nhất trên dữ liệu dòng mạng? 2. Làm thế nào để giảm tỷ lệ false positive xuống dưới 5%? 3. Mô hình có thể hoạt động real-time với throughput > 100 Gbps không?",
      objectives:
        "1. Tiền xử lý và feature engineering trên CIC-IDS2017. 2. Xây dựng mô hình LSTM và Transformer. 3. Tối ưu hyperparameter. 4. Triển khai prototype với giao diện dashboard.",
      literature:
        "IDS sử dụng ML đã được nghiên cứu rộng (Mukherjee 2024, Javaid 2023). Transformer trong an ninh mạng là hướng mới (Wu 2024). Tuy nhiên, hầu hết dừng ở accuracy, chưa xét đến deployment thực tế.",
      methodology:
        "Preprocessing: one-hot encoding, normalization, sliding window. Models: LSTM (2 layers, 128 units), Transformer (4 heads, 2 layers). Baseline: Random Forest, XGBoost. Evaluation: 5-fold cross-validation, precision-recall curves.",
      feasibility:
        "Hoàn toàn khả thi. Bộ dữ liệu công khai. Mô hình chạy được trên GPU một card. Timeline 14 tuần đã được chứng minh qua prototype hiện tại.",
      contribution:
        "1. So sánh toàn diện giữa LSTM và Transformer trên IDS. 2. Pipeline tiền xử lý dữ liệu dòng mạng mở. 3. Prototype dashboard real-time. 4. Bài báo cho hội thảo ISC 2026.",
      ethics:
        "Chỉ sử dụng dữ liệu công khai. Không thu thập dữ liệu người dùng thực.",
      references:
        "1. Javaid, A. (2023). A Deep Learning Approach for Network Intrusion Detection System. 2. Wu, Z. (2024). Transformer for Network Attack Detection.",
    }),
  },
];

// ═══════════════════════════════════════════
// 4. RUBRIC REVIEWS (8 criteria each)
// ═══════════════════════════════════════════

export const mockRubricReviews = [
  {
    id: "rubric-001",
    proposalId: "prop-001",
    reviewer: "Phạm Thị D",
    reviewerId: "4",
    timestamp: "2026-02-20T14:45:00Z",
    criteria: [
      {
        id: "problem_clarity",
        score: 9,
        maxScore: 10,
        aiObservation: "Vấn đề được định nghĩa rõ ràng, có bối cảnh thực tế.",
        reviewerComment:
          "Xuất sắc. Vấn đề và khoảng trống nghiên cứu được trình bày thuyết phục.",
      },
      {
        id: "literature_grounding",
        score: 8,
        maxScore: 10,
        aiObservation:
          "Cơ sở lý thuyết đầy đủ nhưng cần thêm tài liệu cập nhật.",
        reviewerComment:
          "Tốt, nhưng nên bổ sung thêm các công trình 2024-2025.",
      },
      {
        id: "question_quality",
        score: 9,
        maxScore: 10,
        aiObservation: "Câu hỏi nghiên cứu cụ thể, có thể đo lường.",
        reviewerComment: "Các câu hỏi nghiên cứu được chia nhỏ hợp lý.",
      },
      {
        id: "methodology_fit",
        score: 8,
        maxScore: 10,
        aiObservation: "Phương pháp phù hợp, có kế hoạch chi tiết.",
        reviewerComment:
          "Nên bổ sung thêm chi tiết về cách đánh giá hiệu suất.",
      },
      {
        id: "feasibility",
        score: 8,
        maxScore: 10,
        aiObservation: "Kế hoạch khả thi trong 14 tuần.",
        reviewerComment: "Rủi ro về chi phí gas đã được đề cập — tốt.",
      },
      {
        id: "contribution",
        score: 9,
        maxScore: 10,
        aiObservation: "Đóng góp rõ ràng, có giá trị thực tiễn.",
        reviewerComment: "Sản phẩm mã nguồn mở là điểm cộng lớn.",
      },
      {
        id: "ethics_risks",
        score: 7,
        maxScore: 10,
        aiObservation: "Đã đề cập nhưng chưa đầy đủ.",
        reviewerComment:
          "Cần bổ sung quy trình xử lý khi phát hiện lỗ hổng bảo mật.",
      },
      {
        id: "writing_quality",
        score: 8,
        maxScore: 10,
        aiObservation: "Trình bày rõ ràng, có cấu trúc.",
        reviewerComment:
          "Văn phong học thuật tốt. Cần chỉnh sửa một số lỗi chính tả.",
      },
    ],
    totalScore: 8.25,
    comments:
      "Đề tài rất tốt, đáp ứng đầy đủ các tiêu chí. Khuyến nghị phê duyệt sau khi bổ sung phần đạo đức nghiên cứu.",
  },
  {
    id: "rubric-002",
    proposalId: "prop-002",
    reviewer: "Trần Văn H",
    reviewerId: "2",
    timestamp: "2026-02-15T11:20:00Z",
    criteria: [
      {
        id: "problem_clarity",
        score: 7,
        maxScore: 10,
        aiObservation:
          "Vấn đề có ý nghĩa xã hội, nhưng cần dẫn chứng cụ thể hơn.",
        reviewerComment:
          "Tốt. Nên trích dẫn số liệu thống kê cụ thể của Bộ GD&ĐT.",
      },
      {
        id: "literature_grounding",
        score: 7,
        maxScore: 10,
        aiObservation: "Cơ sở lý thuyết còn thiếu tài liệu cập nhật.",
        reviewerComment:
          "Cần bổ sung các nghiên cứu gần đây về ứng dụng ML trong giáo dục.",
      },
      {
        id: "question_quality",
        score: 7,
        maxScore: 10,
        aiObservation: "Câu hỏi rõ ràng nhưng thiếu câu hỏi phụ.",
        reviewerComment:
          "Nên thêm câu hỏi về khả năng tổng quát hóa của mô hình.",
      },
      {
        id: "methodology_fit",
        score: 7,
        maxScore: 10,
        aiObservation:
          "Phương pháp phù hợp nhưng thiếu chi tiết về preprocessing.",
        reviewerComment:
          "Cần mô tả cách xử lý dữ liệu mất cân bằng (imbalanced data).",
      },
      {
        id: "feasibility",
        score: 8,
        maxScore: 10,
        aiObservation: "Khả thi, dữ liệu có sẵn.",
        reviewerComment: "Đã có thỏa thuận với phòng đào tạo?",
      },
      {
        id: "contribution",
        score: 9,
        maxScore: 10,
        aiObservation: "Đóng góp có ý nghĩa thực tiễn cao.",
        reviewerComment: "Hệ thống cảnh báo sớm có tác động xã hội lớn.",
      },
      {
        id: "ethics_risks",
        score: 6,
        maxScore: 10,
        aiObservation: "Chưa đề cập đầy đủ về quyền riêng tư.",
        reviewerComment:
          "Cần xin phép hội đồng đạo đức và mô tả quy trình ẩn danh hóa.",
      },
      {
        id: "writing_quality",
        score: 8,
        maxScore: 10,
        aiObservation: "Trình bày tốt.",
        reviewerComment: "Cấu trúc rõ ràng, dễ theo dõi.",
      },
    ],
    totalScore: 7.375,
    comments:
      "Đề tài tốt, có giá trị thực tiễn cao. Cần bổ sung phần đạo đức và xin phép dữ liệu trước khi phê duyệt.",
  },
  {
    id: "rubric-003",
    proposalId: "prop-003",
    reviewer: "Nguyễn Thị I",
    reviewerId: "2",
    timestamp: "2026-02-10T16:30:00Z",
    criteria: [
      {
        id: "problem_clarity",
        score: 5,
        maxScore: 10,
        aiObservation: "Vấn đề chưa được định nghĩa rõ ràng.",
        reviewerComment:
          "Phạm vi quá rộng. Cần tập trung vào một lĩnh vực cụ thể.",
      },
      {
        id: "literature_grounding",
        score: 4,
        maxScore: 10,
        aiObservation: "Thiếu tài liệu tham khảo quan trọng.",
        reviewerComment: "Cần tổng quan tài liệu có hệ thống hơn.",
      },
      {
        id: "question_quality",
        score: 4,
        maxScore: 10,
        aiObservation: "Câu hỏi nghiên cứu chưa được định nghĩa.",
        reviewerComment:
          "Cần viết lại câu hỏi nghiên cứu theo cấu trúc rõ ràng.",
      },
      {
        id: "methodology_fit",
        score: 3,
        maxScore: 10,
        aiObservation: "Phương pháp chưa được mô tả đầy đủ.",
        reviewerComment:
          "Cần chi tiết về kiến trúc hệ thống, framework, dataset.",
      },
      {
        id: "feasibility",
        score: 5,
        maxScore: 10,
        aiObservation: "Timeline chưa rõ ràng.",
        reviewerComment: "Cần timeline chi tiết theo từng giai đoạn.",
      },
      {
        id: "contribution",
        score: 5,
        maxScore: 10,
        aiObservation: "Đóng góp còn chung chung.",
        reviewerComment: "Cần nêu rõ đóng góp cụ thể cho lĩnh vực.",
      },
      {
        id: "ethics_risks",
        score: 2,
        maxScore: 10,
        aiObservation: "Không đề cập đến đạo đức nghiên cứu.",
        reviewerComment:
          "Cần bổ sung phần này — đặc biệt là bảo mật dữ liệu sinh viên.",
      },
      {
        id: "writing_quality",
        score: 5,
        maxScore: 10,
        aiObservation: "Đề cương sơ sài.",
        reviewerComment: "Cần viết lại với cấu trúc đầy đủ hơn.",
      },
    ],
    totalScore: 4.125,
    comments:
      "Đề tài có ý tưởng tốt nhưng đề cương chưa đạt yêu cầu. Yêu cầu sửa chữa: giới hạn phạm vi, bổ sung cơ sở lý thuyết, chi tiết phương pháp, và phần đạo đức nghiên cứu.",
    decision: "revision_required",
  },
];

// ═══════════════════════════════════════════
// 5. AI FEEDBACK
// ═══════════════════════════════════════════

export const mockAIFeedback = [
  {
    id: "fb-001",
    proposalId: "prop-001",
    timestamp: "2026-02-20T14:45:00Z",
    overallReadiness: 8.5,
    confidence: 0.87,
    strengths: [
      "Vấn đề nghiên cứu được định nghĩa rõ ràng với bối cảnh thực tế",
      "Phương pháp nghiên cứu khoa học, có kế hoạch kiểm thử chi tiết",
      "Công nghệ blockchain và IPFS là giải pháp phù hợp cho vấn đề lưu trữ phân tán",
      "Có benchmark cụ thể (10,000 giao dịch/giây) để đánh giá hiệu suất",
    ],
    issues: [
      {
        severity: "medium",
        category: "literature",
        description: "Cần bổ sung tài liệu tham khảo cập nhật (2024-2025)",
      },
      {
        severity: "low",
        category: "ethics",
        description: "Phân tích đạo đức còn sơ sài",
      },
      {
        severity: "medium",
        category: "scope",
        description: "Phạm vi có thể quá rộng cho một đề tài sinh viên đại học",
      },
    ],
    suggestedRevisions: [
      {
        section: "literature",
        instruction:
          "Bổ sung 5-7 tài liệu tham khảo từ các hội thảo IEEE/ACM gần đây",
      },
      {
        section: "ethics",
        instruction:
          "Mở rộng phần đạo đức: quy trình xử lý khi phát hiện lỗ hổng bảo mật",
      },
      {
        section: "scope",
        instruction:
          "Giới hạn phạm vi: tập trung vào một use case cụ thể (VD: lưu trữ hồ sơ sinh viên)",
      },
    ],
    limitations:
      "AI chưa có khả năng đánh giá tính khả thi về nguồn lực thực tế tại trường. Cần reviewer con người xác nhận.",
    advisoryNotice:
      "Phản hồi này chỉ mang tính chất tham khảo. Quyết định cuối cùng thuộc về hội đồng đánh giá.",
  },
  {
    id: "fb-002",
    proposalId: "prop-002",
    timestamp: "2026-02-15T11:20:00Z",
    overallReadiness: 7.8,
    confidence: 0.82,
    strengths: [
      "Chủ đề có giá trị xã hội và thực tiễn cao",
      "Dữ liệu có sẵn từ hệ thống LMS",
      "Phương pháp so sánh 3 thuật toán là hợp lý",
    ],
    issues: [
      {
        severity: "high",
        category: "data",
        description: "Chưa có xác nhận quyền truy cập dữ liệu từ phòng đào tạo",
      },
      {
        severity: "medium",
        category: "ethics",
        description: "Cần quy trình ẩn danh hóa dữ liệu rõ ràng",
      },
      {
        severity: "low",
        category: "methodology",
        description: "Chưa đề cập đến xử lý dữ liệu mất cân bằng",
      },
    ],
    suggestedRevisions: [
      {
        section: "feasibility",
        instruction: "Bổ sung thư xác nhận hợp tác từ phòng đào tạo",
      },
      {
        section: "ethics",
        instruction: "Chi tiết quy trình ẩn danh hóa và bảo vệ dữ liệu",
      },
    ],
    limitations:
      "Đánh giá dựa trên nội dung đề cương. Không có thông tin về chất lượng dữ liệu thực tế.",
    advisoryNotice:
      "Phản hồi này chỉ mang tính chất tham khảo. Quyết định cuối cùng thuộc về hội đồng đánh giá.",
  },
  {
    id: "fb-003",
    proposalId: "prop-003",
    timestamp: "2026-02-10T16:30:00Z",
    overallReadiness: 6.5,
    confidence: 0.73,
    strengths: [
      "Ứng dụng thực tiễn, có khả năng giảm tải cho phòng đào tạo",
      "Công nghệ NLP đã trưởng thành",
    ],
    issues: [
      {
        severity: "high",
        category: "scope",
        description: "Phạm vi quá rộng cho một đề tài sinh viên",
      },
      {
        severity: "high",
        category: "methodology",
        description: "Kiến trúc hệ thống chưa được mô tả",
      },
      {
        severity: "high",
        category: "data",
        description: "Chưa xác định nguồn dữ liệu huấn luyện",
      },
    ],
    suggestedRevisions: [
      {
        section: "scope",
        instruction:
          "Giới hạn chatbot hỗ trợ một khoa cụ thể thay vì toàn trường",
      },
      {
        section: "methodology",
        instruction: "Bổ sung sơ đồ kiến trúc và luồng xử lý",
      },
      {
        section: "data",
        instruction: "Xây dựng kế hoạch thu thập dataset Q&A",
      },
    ],
    limitations:
      "Đề cương quá sơ sài để đánh giá chi tiết. Cần sinh viên bổ sung trước khi review.",
    advisoryNotice:
      "Phản hồi này chỉ mang tính chất tham khảo. Quyết định cuối cùng thuộc về hội đồng đánh giá.",
  },
  {
    id: "fb-004",
    proposalId: "prop-005",
    timestamp: "2026-03-10T14:00:00Z",
    overallReadiness: 7.0,
    confidence: 0.78,
    strengths: [
      "Hướng nghiên cứu mới cho tiếng Việt",
      "Có kế hoạch dataset cụ thể",
      "Kiến trúc mô hình rõ ràng",
    ],
    issues: [
      {
        severity: "medium",
        category: "data",
        description: "Chưa có nguồn dữ liệu cụ thể từ Shopee/Tiki",
      },
      {
        severity: "low",
        category: "ethics",
        description: "Cần làm rõ quyền sử dụng dữ liệu",
      },
    ],
    suggestedRevisions: [
      {
        section: "feasibility",
        instruction: "Bổ sung kế hoạch thu thập dữ liệu chi tiết",
      },
      {
        section: "ethics",
        instruction:
          "Xác nhận dữ liệu công khai và tuân thủ điều khoản sử dụng API",
      },
    ],
    limitations: "Chi phí GPU chưa được tính toán cụ thể.",
    advisoryNotice:
      "Phản hồi này chỉ mang tính chất tham khảo. Quyết định cuối cùng thuộc về hội đồng đánh giá.",
  },
];

// ═══════════════════════════════════════════
// 6. LECTURERS (with score breakdown)
// ═══════════════════════════════════════════
export const mockLecturers = [
  {
    id: "lec-001",
    name: "Phạm Thị D",
    email: "lecturer@demo.com",
    title: "Giảng viên chính",
    department: "Khoa CNTT",
    expertise: ["Machine Learning", "Data Science", "Python", "Deep Learning"],
    activeProjects: ["Hệ thống gợi ý học tập", "Phân tích dữ liệu giáo dục"],
    currentLoad: 2,
    maxLoad: 3,
    matchScore: 9.2,
    matchReasons: [
      "Chuyên gia về ML với 8 năm kinh nghiệm",
      "Đã hướng dẫn 5 đề tài ML thành công",
      "Có công trình công bố về educational data mining",
    ],
    scoreBreakdown: {
      topicSimilarity: 9.5,
      expertiseFit: 9.0,
      capacityAvailability: 8.0,
      priorSupervision: 9.5,
    },
    risks: [],
  },
  {
    id: "lec-002",
    name: "Trần Văn H",
    email: "tranvanh@demo.com",
    title: "Giảng viên",
    department: "Khoa CNTT",
    expertise: ["Blockchain", "Smart Contracts", "Ethereum", "Web3"],
    activeProjects: [
      "Nghiên cứu Layer 2 scaling",
      "Blockchain cho supply chain",
    ],
    currentLoad: 1,
    maxLoad: 3,
    matchScore: 8.8,
    matchReasons: [
      "Chuyên gia blockchain với 4 năm kinh nghiệm",
      "Đã có 2 bài báo về smart contracts",
      "Đang hướng dẫn 1 đề tài blockchain",
    ],
    scoreBreakdown: {
      topicSimilarity: 9.8,
      expertiseFit: 9.2,
      capacityAvailability: 9.5,
      priorSupervision: 8.0,
    },
    risks: [],
  },
  {
    id: "lec-003",
    name: "Nguyễn Thị I",
    email: "nguyenthii@demo.com",
    title: "Phó Giáo sư",
    department: "Khoa CNTT",
    expertise: ["NLP", "AI", "Deep Learning", "Speech Processing"],
    activeProjects: ["Chatbot tiếng Việt", "Speech recognition cho giáo dục"],
    currentLoad: 3,
    maxLoad: 3,
    matchScore: 7.9,
    matchReasons: ["Chuyên gia NLP hàng đầu", "Đã hướng dẫn 12 đề tài NLP"],
    scoreBreakdown: {
      topicSimilarity: 9.5,
      expertiseFit: 9.0,
      capacityAvailability: 2.0,
      priorSupervision: 9.0,
    },
    risks: [
      {
        type: "capacity",
        label: "Đã đạt tối đa sức chứa hướng dẫn",
        severity: "high",
      },
    ],
  },
  {
    id: "lec-004",
    name: "Lê Minh J",
    email: "leminh@demo.com",
    title: "Giảng viên",
    department: "Khoa CNTT",
    expertise: ["Cryptography", "Security", "Network", "Penetration Testing"],
    activeProjects: ["Mã hóa cho IoT", "Security assessment tool"],
    currentLoad: 2,
    maxLoad: 3,
    matchScore: 8.5,
    matchReasons: [
      "Chuyên gia bảo mật với 6 năm kinh nghiệm",
      "Đã hướng dẫn 3 đề tài về mã hóa",
      "Có chứng chỉ CISSP",
    ],
    scoreBreakdown: {
      topicSimilarity: 9.0,
      expertiseFit: 8.5,
      capacityAvailability: 8.5,
      priorSupervision: 8.0,
    },
    risks: [],
  },
];

// ═══════════════════════════════════════════
// 7. MATCHING SUGGESTIONS (with breakdown)
// ═══════════════════════════════════════════
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
        scoreBreakdown: {
          topicSimilarity: 9.8,
          expertiseFit: 9.2,
          capacityAvailability: 9.5,
          priorSupervision: 8.0,
        },
        reason:
          "Chuyên gia blockchain, phù hợp tuyệt đối với đề tài về Ethereum và smart contracts.",
      },
      {
        lecturerId: "lec-001",
        name: "Phạm Thị D",
        expertise: "Machine Learning",
        matchScore: 7.5,
        scoreBreakdown: {
          topicSimilarity: 7.0,
          expertiseFit: 7.5,
          capacityAvailability: 8.0,
          priorSupervision: 7.8,
        },
        reason:
          "Có kinh nghiệm hệ thống phân tán, có thể hỗ trợ phần distributed storage.",
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
        scoreBreakdown: {
          topicSimilarity: 9.5,
          expertiseFit: 9.0,
          capacityAvailability: 8.0,
          priorSupervision: 9.5,
        },
        reason:
          "Chuyên gia ML với 5 năm kinh nghiệm trong educational data mining.",
      },
      {
        lecturerId: "lec-003",
        name: "Nguyễn Thị I",
        expertise: "AI",
        matchScore: 8.1,
        scoreBreakdown: {
          topicSimilarity: 8.5,
          expertiseFit: 8.5,
          capacityAvailability: 2.0,
          priorSupervision: 9.0,
        },
        reason: "Chuyên gia AI, nhưng đã đạt tối đa sức chứa hướng dẫn.",
        riskNote: "Rủi ro: giảng viên đang đầy tải (3/3).",
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
        scoreBreakdown: {
          topicSimilarity: 9.5,
          expertiseFit: 9.0,
          capacityAvailability: 2.0,
          priorSupervision: 9.0,
        },
        reason: "Chuyên gia NLP hàng đầu, phù hợp tuyệt đối cho chatbot.",
        riskNote: "Rủi ro: giảng viên đang đầy tải (3/3).",
      },
      {
        lecturerId: "lec-001",
        name: "Phạm Thị D",
        expertise: "Machine Learning",
        matchScore: 7.2,
        scoreBreakdown: {
          topicSimilarity: 7.0,
          expertiseFit: 7.5,
          capacityAvailability: 8.0,
          priorSupervision: 7.0,
        },
        reason: "Có kinh nghiệm NLP/ML, có thể hỗ trợ phần classification.",
      },
    ],
  },
  {
    id: "match-004",
    proposalId: "prop-005",
    suggestedLecturers: [
      {
        lecturerId: "lec-001",
        name: "Phạm Thị D",
        expertise: "Machine Learning",
        matchScore: 8.8,
        scoreBreakdown: {
          topicSimilarity: 9.0,
          expertiseFit: 8.5,
          capacityAvailability: 8.0,
          priorSupervision: 9.0,
        },
        reason: "Chuyên gia ML/DL, có kinh nghiệm về multimodal learning.",
      },
    ],
  },
];

// ═══════════════════════════════════════════
// 8. MILESTONES (8 per research lifecycle)
// ═══════════════════════════════════════════
export const mockMilestones = [
  // prop-001 (approved — needs execution milestones)
  {
    id: "ms-001",
    proposalId: "prop-001",
    name: "Đề tài được duyệt",
    type: "proposal_approved",
    order: 1,
    dueDate: "2026-02-20",
    status: "completed",
    progress: 100,
  },
  {
    id: "ms-002",
    proposalId: "prop-001",
    name: "Phân công GVHD",
    type: "supervisor_assigned",
    order: 2,
    dueDate: "2026-03-01",
    status: "completed",
    progress: 100,
  },
  {
    id: "ms-003",
    proposalId: "prop-001",
    name: "Tổng quan tài liệu",
    type: "literature_review",
    order: 3,
    dueDate: "2026-03-31",
    status: "in-progress",
    progress: 60,
  },
  {
    id: "ms-004",
    proposalId: "prop-001",
    name: "Hoàn thiện phương pháp",
    type: "methodology_finalized",
    order: 4,
    dueDate: "2026-04-15",
    status: "not-started",
    progress: 0,
  },
  {
    id: "ms-005",
    proposalId: "prop-001",
    name: "Thu thập dữ liệu",
    type: "data_collection",
    order: 5,
    dueDate: "2026-05-15",
    status: "not-started",
    progress: 0,
  },
  {
    id: "ms-006",
    proposalId: "prop-001",
    name: "Phân tích dữ liệu",
    type: "analysis_complete",
    order: 6,
    dueDate: "2026-06-15",
    status: "not-started",
    progress: 0,
  },
  {
    id: "ms-007",
    proposalId: "prop-001",
    name: "Báo cáo cuối kỳ",
    type: "final_report",
    order: 7,
    dueDate: "2026-06-30",
    status: "not-started",
    progress: 0,
  },
  {
    id: "ms-008",
    proposalId: "prop-001",
    name: "Bảo vệ / Trình bày",
    type: "presentation",
    order: 8,
    dueDate: "2026-07-15",
    status: "not-started",
    progress: 0,
  },

  // prop-006 (completed)
  {
    id: "ms-009",
    proposalId: "prop-006",
    name: "Đề tài được duyệt",
    type: "proposal_approved",
    order: 1,
    dueDate: "2026-01-20",
    status: "completed",
    progress: 100,
  },
  {
    id: "ms-010",
    proposalId: "prop-006",
    name: "Phân công GVHD",
    type: "supervisor_assigned",
    order: 2,
    dueDate: "2026-02-01",
    status: "completed",
    progress: 100,
  },
  {
    id: "ms-011",
    proposalId: "prop-006",
    name: "Tổng quan tài liệu",
    type: "literature_review",
    order: 3,
    dueDate: "2026-02-28",
    status: "completed",
    progress: 100,
  },
  {
    id: "ms-012",
    proposalId: "prop-006",
    name: "Hoàn thiện phương pháp",
    type: "methodology_finalized",
    order: 4,
    dueDate: "2026-03-15",
    status: "completed",
    progress: 100,
  },
  {
    id: "ms-013",
    proposalId: "prop-006",
    name: "Thu thập dữ liệu",
    type: "data_collection",
    order: 5,
    dueDate: "2026-04-15",
    status: "completed",
    progress: 100,
  },
  {
    id: "ms-014",
    proposalId: "prop-006",
    name: "Phân tích dữ liệu",
    type: "analysis_complete",
    order: 6,
    dueDate: "2026-05-30",
    status: "completed",
    progress: 100,
  },
  {
    id: "ms-015",
    proposalId: "prop-006",
    name: "Báo cáo cuối kỳ",
    type: "final_report",
    order: 7,
    dueDate: "2026-06-20",
    status: "completed",
    progress: 100,
  },
  {
    id: "ms-016",
    proposalId: "prop-006",
    name: "Bảo vệ / Trình bày",
    type: "presentation",
    order: 8,
    dueDate: "2026-06-30",
    status: "completed",
    progress: 100,
  },
];

// ═══════════════════════════════════════════
// 9. ADMIN OVERVIEW DATA (derived)
// ═══════════════════════════════════════════
export const mockAdminOverview = {
  totalProposals: 6,
  proposalsByStage: {
    draft: 1,
    ai_pre_check: 1,
    submitted: 0,
    under_review: 1,
    needs_revision: 1,
    approved: 1,
    rejected: 0,
    supervisor_assigned: 0,
    in_progress: 0,
    completed: 1,
  },
  pendingReviews: 2,
  overdueMilestones: 1,
  averageReadinessScore: 7.6,
  reviewerWorkload: {
    2: { name: "Trần Thị B", pending: 2 },
    4: { name: "Phạm Thị D", pending: 0 },
  },
  lecturerCapacity: mockLecturers.map((l) => ({
    id: l.id,
    name: l.name,
    currentLoad: l.currentLoad,
    maxLoad: l.maxLoad,
    available: l.maxLoad - l.currentLoad,
  })),
  bottlenecks: [
    {
      label: "Chờ phân công GVHD",
      count: 1,
      description: "Đề tài prop-001 đã duyệt nhưng chưa có GVHD",
    },
    {
      label: "Quá hạn milestone",
      count: 1,
      description: "prop-001 milestone 'Tổng quan tài liệu' quá hạn 2 tuần",
    },
    {
      label: "GVHD đầy tải",
      count: 1,
      description: "Nguyễn Thị I đã đạt tối đa 3/3",
    },
  ],
};
