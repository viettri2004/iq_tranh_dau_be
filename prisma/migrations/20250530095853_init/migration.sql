-- CreateTable
CREATE TABLE `matches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `player1_id` INTEGER NOT NULL,
    `player2_id` INTEGER NOT NULL,
    `result` ENUM('player1', 'player2', 'draw') NULL,
    `questions` LONGTEXT NOT NULL,
    `player1_answers` LONGTEXT NULL,
    `player2_answers` LONGTEXT NULL,
    `elo_change` LONGTEXT NULL,
    `exp_gain` LONGTEXT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ended_at` DATETIME(0) NULL,

    INDEX `player1_id`(`player1_id`),
    INDEX `player2_id`(`player2_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `options` LONGTEXT NOT NULL,
    `answer` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rooms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `host_player_id` INTEGER NOT NULL,
    `guest_player_id` INTEGER NULL,
    `status` ENUM('waiting', 'playing', 'finished') NULL DEFAULT 'waiting',
    `match_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `guest_player_id`(`guest_player_id`),
    INDEX `host_player_id`(`host_player_id`),
    INDEX `match_id`(`match_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `elo` INTEGER NOT NULL DEFAULT 1200,
    `exp` INTEGER NOT NULL DEFAULT 0,
    `wins` INTEGER NOT NULL DEFAULT 0,
    `losses` INTEGER NOT NULL DEFAULT 0,
    `googleId` VARCHAR(255) NOT NULL,
    `avatarUrl` VARCHAR(255) NULL,
    `totalMatches` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be`(`email`),
    UNIQUE INDEX `IDX_f382af58ab36057334fb262efd`(`googleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_ibfk_1` FOREIGN KEY (`player1_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_ibfk_2` FOREIGN KEY (`player2_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`host_player_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_ibfk_2` FOREIGN KEY (`guest_player_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_ibfk_3` FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
