CREATE DATABASE IF NOT EXISTS `foodmate`
CHARACTER SET utf8
COLLATE utf8_unicode_ci;

SET SQL_MODE='ALLOW_INVALID_DATES';

USE `foodmate`;


/******************************************
* 1: Create tables for chat rooms
******************************************/

CREATE TABLE IF NOT EXISTS `rooms`
(
    `id`  serial COMMENT 'room serial id',
    `title` varchar(12) NOT NULL,
    `description`  varchar(256) NOT NULL,
    `created_at`    timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at`    timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';

/******************************************
* 2: Create tables for chat members
******************************************/

CREATE TABLE IF NOT EXISTS `room_members`
(
    `id`  serial COMMENT 'member mapping serial id',
    `member_id` int(12) NOT NULL,
    `room_id`  int(12) NOT NULL,
    `stat` enum('actived', 'frozen', 'removed', 'leave') DEFAULT 'actived',
    `created_at`    timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at`    timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';


/******************************************
* 3: Create tables for chat messages
******************************************/

CREATE TABLE IF NOT EXISTS `room_messages`
(
    `id`  serial COMMENT 'message mapping serial id',
    `room_id`  int(12) COMMENT 'message mapping serial id',
    `from` int(12) NOT NULL COMMENT 'sender id',
    `to`  int(12) NOT NULL COMMENT 'reciever id',
    `stat` enum('actived', 'frozen', 'removed', 'leave') DEFAULT 'actived',
    `created_at`    timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at`    timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';

