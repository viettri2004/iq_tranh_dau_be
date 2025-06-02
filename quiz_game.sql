CREATE DATABASE IF NOT EXISTS quiz_game CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quiz_game;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE,
    facebook_id VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url VARCHAR(255),
    password_hash VARCHAR(255),
    elo INT DEFAULT 1200,
    exp INT DEFAULT 0,
    total_matches INT DEFAULT 0,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    device_type VARCHAR(100),
    os VARCHAR(100),
    browser VARCHAR(100),
    ip_address VARCHAR(45),
    last_used DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS leaderboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    season VARCHAR(20) DEFAULT 'all_time',
    elo INT NOT NULL,
    `rank` INT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id VARCHAR(100) NOT NULL,        
  player1_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  player2_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  questions TEXT NOT NULL,
  
  player1_score INTEGER DEFAULT 0,
  player2_score INTEGER DEFAULT 0,

  elo_change INTEGER DEFAULT 0,          -- Mức thay đổi Elo sau trận
  exp_gain INTEGER DEFAULT 0,            -- Kinh nghiệm cộng thêm cho mỗi người

  result VARCHAR(20),                    -- 'player1_win' | 'player2_win' | 'draw'

  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    host_player_id INT NOT NULL,
    guest_player_id INT,
    status ENUM('waiting', 'playing', 'finished') DEFAULT 'waiting',
    match_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (host_player_id) REFERENCES users(id),
    FOREIGN KEY (guest_player_id) REFERENCES users(id),
    FOREIGN KEY (match_id) REFERENCES matches(id)
);



CREATE TABLE match_answers (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    options JSON NOT NULL,   -- [{"label": "A", "text": "..."}, ...]
    answer VARCHAR(10) NOT NULL,
    category VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    question_id INT,
    reason TEXT NOT NULL,
    status ENUM('pending', 'reviewed', 'rejected') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME,
    reviewer_note TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    jwt_token TEXT NOT NULL,
    device_info VARCHAR(255),
    ip_address VARCHAR(45),
    login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    logout_time DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS game_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    match_id INT,
    event_type VARCHAR(100) NOT NULL,
    metadata JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (match_id) REFERENCES matches(id)
);


INSERT INTO users (google_id, facebook_id, name, email, password_hash, elo, exp, total_matches, wins, losses) VALUES
(NULL, NULL, 'Diana Thompson', 'user051@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1525, 1469, 48, 23, 25),
(NULL, NULL, 'Leo Jackson', 'user052@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1177, 1404, 27, 0, 27),
(NULL, NULL, 'Violet Hall', 'user053@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1554, 207, 71, 62, 9),
(NULL, NULL, 'Ethan Martinez', 'user054@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1309, 1488, 29, 10, 19),
(NULL, NULL, 'George Anderson', 'user055@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1583, 506, 65, 20, 45),
(NULL, NULL, 'Walter Jackson', 'user056@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1570, 978, 64, 43, 21),
(NULL, NULL, 'Caleb Thompson', 'user057@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1309, 1598, 82, 15, 67),
(NULL, NULL, 'Nathan Robinson', 'user058@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1289, 282, 40, 30, 10),
(NULL, NULL, 'Hazel Garcia', 'user059@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1325, 1647, 83, 43, 40),
(NULL, NULL, 'Bella Lewis', 'user060@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1234, 248, 25, 10, 15),
(NULL, NULL, 'Ethan Thomas', 'user061@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1422, 1426, 66, 53, 13),
(NULL, NULL, 'Peter Lewis', 'user062@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1348, 777, 54, 53, 1),
(NULL, NULL, 'Caleb Walker', 'user063@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1221, 324, 100, 33, 67),
(NULL, NULL, 'Zack Anderson', 'user064@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1043, 407, 75, 48, 27),
(NULL, NULL, 'Queenie White', 'user065@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1026, 635, 66, 13, 53),
(NULL, NULL, 'Kara Lee', 'user066@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1417, 1862, 79, 3, 76),
(NULL, NULL, 'Fiona Anderson', 'user067@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1096, 1232, 74, 4, 70),
(NULL, NULL, 'Zack Taylor', 'user068@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1314, 95, 67, 39, 28),
(NULL, NULL, 'Xena Robinson', 'user069@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1210, 745, 30, 16, 14),
(NULL, NULL, 'Isaac Lewis', 'user070@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1394, 1533, 17, 9, 8),
(NULL, NULL, 'Sara Clark', 'user071@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1588, 369, 33, 28, 5),
(NULL, NULL, 'Walter Rodriguez', 'user072@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1283, 523, 42, 12, 30),
(NULL, NULL, 'Olive Taylor', 'user073@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1238, 530, 12, 3, 9),
(NULL, NULL, 'Diana Jackson', 'user074@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1496, 624, 84, 3, 81),
(NULL, NULL, 'Yvonne Robinson', 'user075@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1075, 851, 31, 18, 13),
(NULL, NULL, 'Kara Walker', 'user076@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1413, 820, 31, 22, 9),
(NULL, NULL, 'Ethan Anderson', 'user077@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1173, 707, 70, 63, 7),
(NULL, NULL, 'Nathan White', 'user078@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1399, 734, 56, 0, 56),
(NULL, NULL, 'Isaac Thompson', 'user079@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1425, 1754, 75, 52, 23),
(NULL, NULL, 'Peter Lee', 'user080@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1493, 1836, 74, 6, 68),
(NULL, NULL, 'Diana Robinson', 'user081@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1205, 156, 79, 5, 74),
(NULL, NULL, 'Megan Garcia', 'user082@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1067, 216, 48, 19, 29),
(NULL, NULL, 'Yvonne Thompson', 'user083@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1062, 91, 24, 1, 23),
(NULL, NULL, 'Megan Walker', 'user084@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1328, 983, 12, 12, 0),
(NULL, NULL, 'Leo Smith', 'user085@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1037, 1654, 17, 13, 4),
(NULL, NULL, 'Violet Johnson', 'user086@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1528, 1234, 11, 5, 6),
(NULL, NULL, 'Zack Jackson', 'user087@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1443, 425, 14, 12, 2),
(NULL, NULL, 'Zack Lee', 'user088@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1284, 300, 59, 12, 47),
(NULL, NULL, 'Ron Taylor', 'user089@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1121, 281, 11, 11, 0),
(NULL, NULL, 'Nathan Lee', 'user090@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1082, 833, 92, 29, 63),
(NULL, NULL, 'Isaac Clark', 'user091@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1021, 1564, 15, 3, 12),
(NULL, NULL, 'Leo Walker', 'user092@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1039, 957, 47, 14, 33),
(NULL, NULL, 'Violet Thomas', 'user093@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1051, 502, 67, 58, 9),
(NULL, NULL, 'Thomas Garcia', 'user094@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1412, 534, 18, 15, 3),
(NULL, NULL, 'Zack Garcia', 'user095@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1301, 1984, 76, 28, 48),
(NULL, NULL, 'Olive Lewis', 'user096@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1460, 738, 38, 20, 18),
(NULL, NULL, 'Megan Smith', 'user097@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1360, 1006, 14, 14, 0),
(NULL, NULL, 'Thomas Harris', 'user098@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1427, 289, 69, 15, 54),
(NULL, NULL, 'Diana Garcia', 'user099@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1376, 725, 40, 11, 29),
(NULL, NULL, 'Hazel Taylor', 'user100@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1488, 1755, 31, 4, 27),
(NULL, NULL, 'Isaac Garcia', 'user101@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1016, 1240, 32, 1, 31),
(NULL, NULL, 'Jade Martin', 'user102@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1322, 1061, 64, 17, 47),
(NULL, NULL, 'Diana Johnson', 'user103@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1187, 65, 83, 23, 60),
(NULL, NULL, 'Ulysses Garcia', 'user104@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1494, 1091, 82, 34, 48),
(NULL, NULL, 'Ulysses Robinson', 'user105@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1068, 1144, 62, 29, 33),
(NULL, NULL, 'Nathan Walker', 'user106@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1298, 1512, 95, 32, 63),
(NULL, NULL, 'Peter Thomas', 'user107@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1301, 1476, 58, 26, 32),
(NULL, NULL, 'Isaac Johnson', 'user108@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1152, 992, 23, 1, 22),
(NULL, NULL, 'Megan Thomas', 'user109@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1188, 611, 10, 6, 4),
(NULL, NULL, 'Kara Harris', 'user110@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1450, 826, 32, 27, 5),
(NULL, NULL, 'Queenie Brown', 'user111@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1463, 186, 21, 9, 12),
(NULL, NULL, 'Zack Lewis', 'user112@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1410, 1899, 92, 47, 45),
(NULL, NULL, 'Xena Harris', 'user113@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1338, 700, 78, 33, 45),
(NULL, NULL, 'Violet White', 'user114@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1487, 649, 93, 76, 17),
(NULL, NULL, 'Diana Walker', 'user115@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1594, 547, 89, 69, 20),
(NULL, NULL, 'Fiona Brown', 'user116@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1145, 834, 73, 9, 64),
(NULL, NULL, 'Yvonne Brown', 'user117@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1094, 1823, 78, 64, 14),
(NULL, NULL, 'Sara Johnson', 'user118@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1417, 340, 75, 44, 31),
(NULL, NULL, 'Alex Smith', 'user119@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1043, 646, 31, 23, 8),
(NULL, NULL, 'Caleb Martinez', 'user120@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1491, 1964, 75, 54, 21),
(NULL, NULL, 'Walter Smith', 'user121@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1065, 177, 73, 29, 44),
(NULL, NULL, 'George Taylor', 'user122@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1148, 1000, 85, 36, 49),
(NULL, NULL, 'Ethan Garcia', 'user123@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1306, 1913, 84, 80, 4),
(NULL, NULL, 'George Harris', 'user124@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1023, 864, 99, 47, 52),
(NULL, NULL, 'Fiona Rodriguez', 'user125@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1118, 1014, 30, 4, 26),
(NULL, NULL, 'Ulysses Martin', 'user126@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1331, 1779, 18, 0, 18),
(NULL, NULL, 'Bella Harris', 'user127@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1270, 1517, 13, 8, 5),
(NULL, NULL, 'Ron Jackson', 'user128@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1233, 1813, 44, 40, 4),
(NULL, NULL, 'Diana Lewis', 'user129@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1416, 1335, 97, 29, 68),
(NULL, NULL, 'Isaac Thomas', 'user130@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1463, 177, 12, 5, 7),
(NULL, NULL, 'Olive Martinez', 'user131@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1491, 1310, 59, 35, 24),
(NULL, NULL, 'George Rodriguez', 'user132@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1259, 590, 61, 16, 45),
(NULL, NULL, 'Thomas Johnson', 'user133@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1487, 1374, 58, 43, 15),
(NULL, NULL, 'Bella Walker', 'user134@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1118, 1205, 33, 2, 31),
(NULL, NULL, 'Zack Thompson', 'user135@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1164, 705, 67, 31, 36),
(NULL, NULL, 'Jade Anderson', 'user136@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1204, 1805, 25, 0, 25),
(NULL, NULL, 'Walter Hall', 'user137@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1443, 1476, 87, 46, 41),
(NULL, NULL, 'Alex Martin', 'user138@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1299, 1279, 38, 2, 36),
(NULL, NULL, 'George Robinson', 'user139@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1279, 1875, 25, 25, 0),
(NULL, NULL, 'Olive White', 'user140@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1319, 1094, 23, 14, 9),
(NULL, NULL, 'Zack Johnson', 'user141@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1576, 1364, 75, 8, 67),
(NULL, NULL, 'Olive Hall', 'user142@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1491, 503, 27, 25, 2),
(NULL, NULL, 'Alex Brown', 'user143@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1158, 979, 82, 19, 63),
(NULL, NULL, 'Caleb Robinson', 'user144@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1345, 1783, 23, 9, 14),
(NULL, NULL, 'Walter Brown', 'user145@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1118, 283, 71, 57, 14),
(NULL, NULL, 'Sara Taylor', 'user146@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1194, 713, 31, 8, 23),
(NULL, NULL, 'Ron White', 'user147@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1304, 1461, 15, 10, 5),
(NULL, NULL, 'Peter Jackson', 'user148@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1110, 1092, 24, 3, 21),
(NULL, NULL, 'Ron Harris', 'user149@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1204, 1865, 83, 35, 48),
(NULL, NULL, 'Peter Anderson', 'user150@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1257, 777, 19, 12, 7),
(NULL, NULL, 'George Thompson', 'user151@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1162, 1188, 68, 22, 46),
(NULL, NULL, 'Diana Rodriguez', 'user152@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1278, 655, 47, 14, 33),
(NULL, NULL, 'Fiona Martin', 'user153@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1393, 1781, 56, 1, 55),
(NULL, NULL, 'Caleb Johnson', 'user154@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1389, 1591, 95, 47, 48),
(NULL, NULL, 'Kara Hall', 'user155@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1486, 669, 96, 29, 67),
(NULL, NULL, 'Ethan Rodriguez', 'user156@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1499, 1895, 42, 8, 34),
(NULL, NULL, 'Ron Garcia', 'user157@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1152, 1422, 100, 82, 18),
(NULL, NULL, 'Thomas Smith', 'user158@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1157, 1886, 69, 39, 30),
(NULL, NULL, 'Jade Harris', 'user159@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1332, 1511, 66, 36, 30),
(NULL, NULL, 'Peter Smith', 'user160@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1268, 1377, 22, 17, 5),
(NULL, NULL, 'Nathan Smith', 'user161@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1516, 1022, 42, 16, 26),
(NULL, NULL, 'Isaac Taylor', 'user162@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1405, 1160, 100, 38, 62),
(NULL, NULL, 'Zack Harris', 'user163@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1176, 529, 17, 4, 13),
(NULL, NULL, 'Peter Martin', 'user164@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1041, 687, 95, 16, 79),
(NULL, NULL, 'George Johnson', 'user165@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1212, 912, 72, 47, 25),
(NULL, NULL, 'Ulysses Hall', 'user166@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1012, 621, 29, 28, 1),
(NULL, NULL, 'Thomas Robinson', 'user167@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1098, 636, 96, 7, 89),
(NULL, NULL, 'Ron Thomas', 'user168@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1127, 679, 63, 24, 39),
(NULL, NULL, 'Hazel Martin', 'user169@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1088, 874, 93, 48, 45),
(NULL, NULL, 'Nathan Harris', 'user170@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1516, 1164, 79, 29, 50),
(NULL, NULL, 'Kara Clark', 'user171@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1229, 1774, 67, 3, 64),
(NULL, NULL, 'Yvonne Martinez', 'user172@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1519, 1553, 37, 13, 24),
(NULL, NULL, 'Peter Thompson', 'user173@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1075, 1891, 21, 15, 6),
(NULL, NULL, 'Fiona Hall', 'user174@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1382, 333, 62, 15, 47),
(NULL, NULL, 'Ulysses Johnson', 'user175@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1031, 1751, 29, 22, 7),
(NULL, NULL, 'Megan Clark', 'user176@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1433, 1801, 20, 0, 20),
(NULL, NULL, 'George Hall', 'user177@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1365, 38, 39, 22, 17),
(NULL, NULL, 'Bella Anderson', 'user178@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1258, 275, 12, 10, 2),
(NULL, NULL, 'Peter Johnson', 'user179@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1425, 542, 32, 15, 17),
(NULL, NULL, 'Queenie Garcia', 'user180@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1112, 896, 59, 31, 28),
(NULL, NULL, 'Queenie Walker', 'user181@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1360, 1613, 72, 63, 9),
(NULL, NULL, 'Caleb Lee', 'user182@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1353, 652, 72, 53, 19),
(NULL, NULL, 'Yvonne Clark', 'user183@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1243, 312, 60, 15, 45),
(NULL, NULL, 'Peter Taylor', 'user184@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1469, 1339, 96, 95, 1),
(NULL, NULL, 'Queenie Harris', 'user185@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1390, 433, 72, 41, 31),
(NULL, NULL, 'Megan Jackson', 'user186@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1573, 1382, 81, 79, 2),
(NULL, NULL, 'Olive Harris', 'user187@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1154, 1629, 64, 32, 32),
(NULL, NULL, 'Isaac Martin', 'user188@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1234, 1013, 42, 11, 31),
(NULL, NULL, 'Xena Smith', 'user189@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1571, 1349, 20, 20, 0),
(NULL, NULL, 'Queenie Martin', 'user190@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1577, 865, 18, 11, 7),
(NULL, NULL, 'Thomas Rodriguez', 'user191@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1086, 1312, 53, 29, 24),
(NULL, NULL, 'Isaac Anderson', 'user192@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1308, 180, 26, 24, 2),
(NULL, NULL, 'Nathan Garcia', 'user193@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1592, 947, 25, 13, 12),
(NULL, NULL, 'Jade Rodriguez', 'user194@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1279, 1761, 83, 32, 51),
(NULL, NULL, 'Ethan Harris', 'user195@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1443, 926, 43, 39, 4),
(NULL, NULL, 'Ulysses Lewis', 'user196@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1498, 904, 38, 9, 29),
(NULL, NULL, 'Xena Clark', 'user197@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1219, 859, 54, 11, 43),
(NULL, NULL, 'Xena Rodriguez', 'user198@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1431, 36, 80, 68, 12),
(NULL, NULL, 'Ulysses Thompson', 'user199@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1470, 372, 57, 4, 53),
(NULL, NULL, 'Nathan Martinez', 'user200@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1372, 1417, 62, 38, 24),
(NULL, NULL, 'Ulysses Clark', 'user201@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1484, 1755, 37, 25, 12),
(NULL, NULL, 'Caleb Lewis', 'user202@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1242, 628, 24, 15, 9),
(NULL, NULL, 'Megan Brown', 'user203@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1204, 586, 88, 9, 79),
(NULL, NULL, 'Diana Brown', 'user204@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1269, 359, 52, 11, 41),
(NULL, NULL, 'George Walker', 'user205@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1535, 99, 59, 58, 1),
(NULL, NULL, 'Jade Thomas', 'user206@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1580, 364, 15, 14, 1),
(NULL, NULL, 'Walter Clark', 'user207@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1396, 1425, 44, 8, 36),
(NULL, NULL, 'Violet Lewis', 'user208@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1459, 769, 61, 55, 6),
(NULL, NULL, 'Ethan Lewis', 'user209@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1516, 981, 100, 88, 12),
(NULL, NULL, 'Yvonne Thomas', 'user210@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1291, 967, 22, 14, 8),
(NULL, NULL, 'Queenie Thompson', 'user211@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1407, 1235, 61, 1, 60),
(NULL, NULL, 'Megan Lee', 'user212@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1245, 1501, 84, 66, 18),
(NULL, NULL, 'Ethan Lee', 'user213@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1092, 1478, 53, 23, 30),
(NULL, NULL, 'Kara Smith', 'user214@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1191, 1117, 90, 1, 89),
(NULL, NULL, 'Peter Robinson', 'user215@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1487, 1762, 26, 8, 18),
(NULL, NULL, 'Nathan Hall', 'user216@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1111, 968, 34, 4, 30),
(NULL, NULL, 'Isaac Robinson', 'user217@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1288, 489, 67, 2, 65),
(NULL, NULL, 'Alex White', 'user218@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1169, 275, 93, 81, 12),
(NULL, NULL, 'Thomas Jackson', 'user219@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1487, 698, 16, 14, 2),
(NULL, NULL, 'Nathan Brown', 'user220@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1117, 1113, 50, 7, 43),
(NULL, NULL, 'Bella Garcia', 'user221@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1029, 1642, 55, 23, 32),
(NULL, NULL, 'Leo Robinson', 'user222@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1061, 522, 84, 63, 21),
(NULL, NULL, 'Leo Harris', 'user223@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1477, 1668, 89, 74, 15),
(NULL, NULL, 'Xena Johnson', 'user224@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1407, 1115, 70, 21, 49),
(NULL, NULL, 'Walter White', 'user225@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1111, 1202, 50, 2, 48),
(NULL, NULL, 'Yvonne Smith', 'user226@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1074, 1567, 43, 10, 33),
(NULL, NULL, 'Fiona Smith', 'user227@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1432, 1951, 42, 15, 27),
(NULL, NULL, 'Xena Lee', 'user228@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1024, 1571, 85, 60, 25),
(NULL, NULL, 'Zack Robinson', 'user229@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1242, 1555, 71, 69, 2),
(NULL, NULL, 'Ulysses Martinez', 'user230@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1435, 969, 11, 9, 2),
(NULL, NULL, 'Zack Thomas', 'user231@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1215, 133, 29, 5, 24),
(NULL, NULL, 'Kara Robinson', 'user232@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1333, 1293, 23, 6, 17),
(NULL, NULL, 'Xena Walker', 'user233@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1257, 1034, 18, 2, 16),
(NULL, NULL, 'Violet Robinson', 'user234@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1130, 347, 57, 19, 38),
(NULL, NULL, 'Nathan Johnson', 'user235@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1567, 1726, 20, 1, 19),
(NULL, NULL, 'Leo Garcia', 'user236@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1213, 1919, 64, 25, 39),
(NULL, NULL, 'Walter Thompson', 'user237@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1244, 738, 82, 55, 27),
(NULL, NULL, 'George Martinez', 'user238@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1444, 1240, 72, 28, 44),
(NULL, NULL, 'Alex Thompson', 'user239@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1088, 1627, 41, 14, 27),
(NULL, NULL, 'Hazel Thomas', 'user240@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1272, 143, 10, 9, 1),
(NULL, NULL, 'Peter Hall', 'user241@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1508, 429, 25, 7, 18),
(NULL, NULL, 'Megan Robinson', 'user242@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1123, 1177, 75, 37, 38),
(NULL, NULL, 'Alex Garcia', 'user243@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1445, 1495, 95, 21, 74),
(NULL, NULL, 'Ethan Jackson', 'user244@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1334, 762, 91, 34, 57),
(NULL, NULL, 'Sara Rodriguez', 'user245@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1470, 1397, 60, 12, 48),
(NULL, NULL, 'Zack Clark', 'user246@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1391, 606, 100, 69, 31),
(NULL, NULL, 'Ron Johnson', 'user247@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1303, 65, 72, 41, 31),
(NULL, NULL, 'Hazel Harris', 'user248@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1172, 945, 98, 45, 53),
(NULL, NULL, 'Zack Martin', 'user249@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1235, 791, 54, 50, 4),
(NULL, NULL, 'Walter Walker', 'user250@example.com', '$2b$10$SBJKooZg3KPX1ADz7r6kYefIX6oAmKKLurNpzlehn2zpIGkIGaJLa', 1011, 116, 67, 30, 37);

INSERT INTO categories (name)
VALUES 
('Toán học'),
('Lịch sử'),
('Tin học'),
('Văn học'),
('Địa lý'),
('Vật lý'),
('Hóa học'),
('Sinh học'),
('Ngoại ngữ'),
('Giáo dục công dân'),
('Âm nhạc'),
('Mỹ thuật'),
('Thể dục'),
('Kinh tế'),
('Khoa học'),
('Công nghệ'),
('Tâm lý học'),
('Triết học');



