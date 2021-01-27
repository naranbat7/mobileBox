/*
SQLyog Community v13.1.7 (64 bit)
MySQL - 10.4.17-MariaDB : Database - mobilebox
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`mobilebox` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `mobilebox`;

/*Table structure for table `admin` */

DROP TABLE IF EXISTS `admin`;

CREATE TABLE `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `telNumber` char(8) DEFAULT NULL,
  `imgLink` varchar(100) DEFAULT NULL,
  `username` varchar(40) NOT NULL,
  `pass` varchar(100) NOT NULL,
  `isFullAdmin` int(11) NOT NULL,
  `token` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `telNumber` (`telNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8;

/*Data for the table `admin` */

insert  into `admin`(`id`,`name`,`telNumber`,`imgLink`,`username`,`pass`,`isFullAdmin`,`token`) values 
(53,'admin2',NULL,NULL,'admin2','$2b$10$94zdZGhQQb6XfNd9fgYBOurmj5jWY.Shia8NHly.5ETqWIToT8zfG',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluMiIsImlkIjo1MywiaWF0IjoxNjExNDcyNzQ4LCJleHAiOjE2MTE0ODM1NDh9.rK13aZSBUr1uuAdCGVlGiG1lp851r2SdgCHzE-cb684');

/*Table structure for table `daatgal` */

DROP TABLE IF EXISTS `daatgal`;

CREATE TABLE `daatgal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `userid` int(11) NOT NULL,
  `chooseid` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  KEY `chooseid` (`chooseid`),
  CONSTRAINT `daatgal_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `user` (`id`),
  CONSTRAINT `daatgal_ibfk_2` FOREIGN KEY (`chooseid`) REFERENCES `insurance_choose` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `daatgal` */

insert  into `daatgal`(`id`,`start_date`,`userid`,`chooseid`) values 
(1,'2020-07-20 20:40:00',1,1);

/*Table structure for table `daatgal_purchase_tries` */

DROP TABLE IF EXISTS `daatgal_purchase_tries`;

CREATE TABLE `daatgal_purchase_tries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `try_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_success` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `choose_id` int(11) NOT NULL,
  `invoice_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `choose_id` (`choose_id`),
  CONSTRAINT `daatgal_purchase_tries_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `daatgal_purchase_tries_ibfk_2` FOREIGN KEY (`choose_id`) REFERENCES `insurance_choose` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

/*Data for the table `daatgal_purchase_tries` */

/*Table structure for table `insurance_choose` */

DROP TABLE IF EXISTS `insurance_choose`;

CREATE TABLE `insurance_choose` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `duration` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `insurance_choose` */

insert  into `insurance_choose`(`id`,`duration`,`price`) values 
(1,12,10000),
(2,12,25000);

/*Table structure for table `location` */

DROP TABLE IF EXISTS `location`;

CREATE TABLE `location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location_x` int(11) NOT NULL,
  `location_y` int(11) NOT NULL,
  `location_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `userid` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  CONSTRAINT `location_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `location` */

/*Table structure for table `product` */

DROP TABLE IF EXISTS `product`;

CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `total` int(11) NOT NULL,
  `imgLink` varchar(100) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

/*Data for the table `product` */

insert  into `product`(`id`,`name`,`total`,`imgLink`,`price`,`description`,`createdDate`) values 
(12,'Brent Hurley',74,'12.png',88343452,'Velit aliqua Ex co','2021-01-22 07:54:17');

/*Table structure for table `product_purchase` */

DROP TABLE IF EXISTS `product_purchase`;

CREATE TABLE `product_purchase` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchase_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `amount` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `productid` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  KEY `productid` (`productid`),
  CONSTRAINT `product_purchase_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `user` (`id`),
  CONSTRAINT `product_purchase_ibfk_2` FOREIGN KEY (`productid`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `product_purchase` */

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lastname` varchar(40) NOT NULL,
  `firstname` varchar(40) NOT NULL,
  `email` varchar(40) NOT NULL,
  `telnumber` char(8) NOT NULL,
  `pass` varchar(100) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `token` text DEFAULT NULL,
  `code` varchar(100) DEFAULT NULL,
  `imei` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `telnumber` (`telnumber`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`id`,`lastname`,`firstname`,`email`,`telnumber`,`pass`,`created_date`,`token`,`code`,`imei`) values 
(1,'user2','user1','user1@gmail.com','88921834','$2b$10$/Sjsxx7YKGXv8EYHe01z.eosplS0h/YbafiaiCHC6UpDt92An2uVu','2021-01-21 20:41:31','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsImlkIjoxLCJ0ZWxudW1iZXIiOiI4ODkyMTgzNCIsImlhdCI6MTYxMTI3MzIxMn0.bX-X9ZvycMK9nhQIriXkM5v1TVyuym65gZpL8UC_cww','$2b$10$yyr0iYZ9MWkAWAlVTR4NTuMxzsQi4a5dvW6ZYOivW1aXnuuM7TuLC',NULL),
(6,'user2','user2','user2@gmail.com','88921838','$2b$10$nc.NeTF.4mlqZzQX/PU0j.XMyJYjm.Z6WeldrPDBodg5ZCuniUeVK','2021-01-22 00:07:10',NULL,NULL,NULL),
(7,'user2','user2','user@gmail.com','88921835','$2b$10$YG/KqNK/DBLFmoi69Hxer.dC0at4wnouFm.jd42uNHoNugwsTaDRW','2021-01-23 02:18:15',NULL,NULL,NULL),
(10,'user3','user3','user3@gmail.com','88921833','$2b$10$yyr0iYZ9MWkAWAlVTR4NTuMxzsQi4a5dvW6ZYOivW1aXnuuM7TuLC','2021-01-23 02:18:39','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIzQGdtYWlsLmNvbSIsImlkIjoxMCwidGVsbnVtYmVyIjoiODg5MjE4MzMiLCJpYXQiOjE2MTE2NzY1MzR9.Oj0GZRl8u8g3csA3SeAbd6PYLDdaCHcZ9C5Bm944SBg',NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
