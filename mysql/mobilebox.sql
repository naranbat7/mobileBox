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
  `token` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `telNumber` (`telNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8;

/*Data for the table `admin` */

insert  into `admin`(`id`,`name`,`telNumber`,`imgLink`,`username`,`pass`,`isFullAdmin`,`token`) values 
(1,'admin',NULL,NULL,'admin','admin',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOjEsImlhdCI6MTYxMTA1OTA5NywiZXhwIjoxNjExMDY5ODk3fQ.J9akzgboMNP3PyxV9Cjisjc6eMWsNx-U1SLNB3Ax-O4'),
(2,'Ганбаяр2','123',NULL,'admin3','admin3',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluMyIsImlkIjoyLCJpYXQiOjE2MTEwNTkwODYsImV4cCI6MTYxMTA2OTg4Nn0.V_Y6ihOIi8zC5dI8hhsXjzwtvg3pB2fHb2J9KO3xpQM');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
