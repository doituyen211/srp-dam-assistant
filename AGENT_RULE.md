Bạn là senior frontend engineer.

Tôi đã có một project Next.js App Router dùng JavaScript/JSX + TailwindCSS. Project này là UI MVP cho “AI Trợ Lý Soạn & Quản Lý Đề Tài Nghiên Cứu Khoa Học Sinh Viên”.

Hiện tại tôi có một giao diện đẹp được viết bằng HTML thuần + CSS thuần. Nhiệm vụ của bạn là chuyển tinh thần thiết kế, layout, spacing, màu sắc, typography, card style, button style, form style từ HTML/CSS đó sang project Next.js hiện tại.

Nguyên tắc bắt buộc:

- Chỉ làm frontend.
- Chỉ dùng JavaScript + JSX.
- Không tạo .ts, .tsx, tsconfig.json.
- Không tạo backend.
- Không gọi API thật.
- Không gọi OpenAI/Claude thật.
- Không phá mock API hiện tại.
- Không phá auth flow hiện tại.
- Không phá route hiện tại.
- Không phá role-based navigation hiện tại.
- Không thêm UI library nặng.
- Ưu tiên TailwindCSS.
- Không copy nguyên xi HTML thuần nếu làm vỡ component structure.
- Hãy tái cấu trúc thành component Next.js sạch, maintainable.
- Giữ các page hiện có:
  - /
  - /login
  - /dashboard
  - /proposals
  - /proposals/new
  - /proposals/[id]
  - /review
  - /matching
  - /admin

Đầu vào tôi sẽ cung cấp:

1. File HTML thuần.
2. File CSS thuần.
3. Project Next.js hiện tại.

Cách làm:

1. Đọc HTML/CSS cũ.
2. Xác định design system:
   - color palette
   - typography
   - spacing
   - border radius
   - shadow
   - card style
   - button style
   - input/form style
   - table style
   - sidebar/topbar style
   - responsive behavior
3. Map design system đó sang TailwindCSS.
4. Cập nhật các component reusable trước:
   - Button
   - Card
   - Badge
   - Input
   - Textarea
   - Select
   - Alert
   - LoadingState
   - EmptyState
5. Sau đó cập nhật layout:
   - AppShell
   - Sidebar
   - Topbar
   - ProtectedRoute nếu cần rất ít, nhưng không đổi logic auth
6. Sau đó cập nhật các business components:
   - ProposalCard
   - ProposalForm
   - ProposalStatusBadge
   - AIFeedbackPanel
   - RubricScoreCard
   - ReviewTable
   - LecturerMatchCard
7. Cuối cùng cập nhật các page để đồng bộ visual:
   - landing page
   - login page
   - dashboard
   - proposals
   - proposal detail
   - review
   - matching
   - admin
8. Giữ nguyên dữ liệu mock và API contract.
9. Sau khi sửa, chạy lint/build nếu môi trường cho phép.
10. Báo cáo file đã sửa và các thay đổi chính.

Quan trọng:

- Không chỉ đổi màu lặt vặt. Hãy chuyển “visual language” của HTML/CSS cũ thành design system nhất quán cho toàn app.
- Không hardcode style trùng lặp quá nhiều ở từng page.
- Nếu CSS cũ có class như .btn, .card, .sidebar, .hero, hãy chuyển tinh thần đó vào component Tailwind tương ứng.
- Nếu CSS cũ có animation đẹp nhưng đơn giản, có thể giữ bằng Tailwind hoặc globals.css.
- Nếu animation phức tạp hoặc không cần thiết cho MVP, bỏ qua.
- Ưu tiên giao diện đẹp, sạch, responsive, demo được.
