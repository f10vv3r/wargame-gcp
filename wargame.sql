CREATE TABLE `users` (
  `usr_idx` int NOT NULL AUTO_INCREMENT,
  `id` varchar(60) NOT NULL,
  `pw` char(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `class` int NOT NULL,
  `score` int DEFAULT '0',
  `flag` json DEFAULT NULL,
  `usr_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`usr_idx`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `email` (`email`)
);

CREATE TABLE `problems` (
  `pro_idx` int NOT NULL AUTO_INCREMENT,
  `usr_idx` int NOT NULL,
  `title` text NOT NULL,
  `text` text NOT NULL,
  `category` varchar(60) NOT NULL,
  `score` int NOT NULL DEFAULT '0',
  `flag` varchar(256) NOT NULL,
  `port` int DEFAULT NULL,
  `file` varchar(256) NOT NULL,
  `pro_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pro_idx`)
);

CREATE TABLE `comments` (
  `com_idx` int NOT NULL AUTO_INCREMENT,
  `com_group` int NOT NULL DEFAULT '0',
  `usr_idx` int NOT NULL,
  `usr_id` varchar(60) NOT NULL,
  `pro_idx` int NOT NULL,
  `text` text NOT NULL,
  `depth` int NOT NULL,
  `com_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`com_idx`)
);

CREATE TABLE `votes` (
  `vote_idx` int NOT NULL AUTO_INCREMENT,
  `usr_idx` int NOT NULL,
  `pro_idx` int NOT NULL,
  `vote_value` int NOT NULL,
  `vote_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`vote_idx`),
  KEY `pro_idx` (`pro_idx`)
);

CREATE TABLE `flag_log` (
  `flg_idx` int NOT NULL AUTO_INCREMENT,
  `pro_idx` int NOT NULL,
  `pro_title` varchar(60) NOT NULL,
  `usr_idx` int NOT NULL,
  `usr_id` varchar(60) NOT NULL,
  `flag` varchar(60) NOT NULL,
  `status` varchar(60) NOT NULL,
  `flg_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`flg_idx`)
);

CREATE TABLE `reports` (
  `rep_idx` int NOT NULL AUTO_INCREMENT,
  `usr_idx` int NOT NULL,
  `usr_id` varchar(60) NOT NULL,
  `pro_idx` int NOT NULL,
  `content` text NOT NULL,
  `rep_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`rep_idx`)
);
