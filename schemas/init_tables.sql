CREATE DATABASE IF NOT EXISTS `foodmate-ws-api-dev`
CHARACTER SET utf8
COLLATE utf8_unicode_ci;

SET SQL_MODE='ALLOW_INVALID_DATES';

USE `foodmate-ws-api-dev`;

/******************************************
* 1: Create tables for room
******************************************/

/** AdminLog **/
CREATE TABLE IF NOT EXISTS `rooms`
(
    `room_id`  serial COMMENT 'Admin log serial id',
    `name` varchar(36) NOT NULL,
    `description` text NOT NULL, 
    PRIMARY KEY (`room_id`)
) ENGINE = InnoDB COLLATE = 'utf8_unicode_ci';