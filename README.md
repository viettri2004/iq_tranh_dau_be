# 🎮 2-Player Quiz Game - Backend API (NestJS)

Một hệ thống trò chơi đố vui đối kháng giữa 2 người chơi, sử dụng Google Login để xác thực, hỗ trợ chơi theo phòng (matchmaking), chấm điểm theo thời gian thực và tính ELO cho người chơi.

---

## 🚀 Tính năng chính

### 1. 🔐 Xác thực người dùng (Authentication)

- Đăng nhập bằng Google ID Token
- Cấp phát JWT Token và lưu phiên đăng nhập (Sessions)
- Mỗi request API và kết nối socket yêu cầu token hợp lệ

### 2. 👤 Quản lý người dùng

- Lấy thông tin người dùng hiện tại (`/users/me`)
- Cập nhật thông tin cá nhân
- Ghi nhận thông tin thiết bị đăng nhập

### 3. 🕹️ Quản lý phòng chơi (Rooms)

- Tạo phòng chơi
- Tìm phòng chờ để ghép cặp
- Tham gia / rời phòng
- Gửi sự kiện qua WebSocket để đồng bộ trạng thái phòng (room_update)

### 4. 🤜🤛 Bắt đầu trận đấu (Matches)

- Khởi tạo trận khi có 2 người trong phòng
- Lấy danh sách câu hỏi cho trận đấu
- Trả lời câu hỏi (nộp đáp án)
- Kết thúc trận khi cả 2 người đã hoàn tất

### 5. 📝 Nộp đáp án (`/matches/:matchId/submit`)

- Nhận danh sách các câu trả lời từ người chơi
- Chấm điểm, cập nhật kết quả trận đấu
- Gửi kết quả cuối trận qua WebSocket (`match_result`)

### 6. 📈 Tính điểm ELO & EXP

- Hệ thống tính điểm thưởng/thua theo thuật toán ELO
- Cộng điểm kinh nghiệm để xếp hạng người chơi

### 7. 🔌 Kết nối WebSocket

- Gửi và nhận các sự kiện:
  - `room_update`: cập nhật trạng thái phòng
  - `match_start`: bắt đầu trận đấu
  - `match_result`: thông báo kết quả trận

---

## 🛠️ Công nghệ sử dụng

| Công nghệ             | Mục đích                              |
| --------------------- | ------------------------------------- |
| **NestJS**            | Framework backend chính               |
| **TypeORM**           | ORM tương tác với cơ sở dữ liệu       |
| **MySQL**             | Cơ sở dữ liệu quan hệ                 |
| **JWT**               | Xác thực và cấp token đăng nhập       |
| **Google OAuth2**     | Xác thực người dùng qua Google        |
| **Socket.IO**         | Giao tiếp thời gian thực WebSocket    |
| **Swagger (OpenAPI)** | Tài liệu hóa API và thử trực tiếp     |
| **dotenv**            | Quản lý biến môi trường               |
| **class-validator**   | Kiểm tra dữ liệu vào từ client        |
| **CORS**              | Cho phép frontend khác domain gọi API |

---

## 🧪 Ví dụ API

**Submit Answer Example**:

```json
POST /matches/12/submit
{
  "userId": 1,
  "answers": [
    { "questionId": 101, "answer": "A" },
    { "questionId": 102, "answer": "B" }
  ]
}
```
