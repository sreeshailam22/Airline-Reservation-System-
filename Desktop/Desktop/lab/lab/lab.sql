/*
SQLyog Community Edition- MySQL GUI v6.07
Host - 5.0.67-community-nt : Database - lab
*********************************************************************
Server version : 5.0.67-community-nt
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

create database if not exists `lab`;

USE `lab`;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*Table structure for table `admin` */

DROP TABLE IF EXISTS `admin`;

CREATE TABLE `admin` (
  `admin_id` int(30) NOT NULL auto_increment,
  `name` varchar(40) default NULL,
  `email` varchar(50) default NULL,
  `password` varchar(50) default NULL,
  PRIMARY KEY  (`admin_id`),
  UNIQUE KEY `unique_admin` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `admin` */

insert  into `admin`(`admin_id`,`name`,`email`,`password`) values (1,'admin','admin@gmail.com','admin');

/*Table structure for table `sample` */

DROP TABLE IF EXISTS `sample`;

CREATE TABLE `sample` (
  `sample_id` varchar(100) NOT NULL,
  `test_type` varchar(20) default NULL,
  `email` varchar(100) default NULL,
  `user_info` varchar(500) default NULL,
  `a_report` varchar(200) default NULL,
  PRIMARY KEY  (`sample_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `sample` */

insert  into `sample`(`sample_id`,`test_type`,`email`,`user_info`,`a_report`) values ('5ff8571a33','Blood Sugar Test','sai@gmail.com','Test Type: Blood Sugar Test, Fasting: Yes, Last Meal: 1 o clock','Test Type: Blood Sugar Test; Fasting Blood Sugar: 80 mg/dL (Normal Range: 70-99 mg/dL), Post-Meal Blood Sugar: 136 mg/dL (Normal Range: <140 mg/dL)'),('73e16596ca','Blood Sugar Test','sai@gmail.com','Test Type: Blood Sugar Test, Fasting: Yes, Last Meal: 1 o clock','Test Type: Blood Sugar Test; Fasting Blood Sugar: 134 mg/dL (Normal Range: 70-99 mg/dL); Post-Meal Blood Sugar: 98 mg/dL (Normal Range: <140 mg/dL)'),('9ba61dcd8b','HbA1c Test','msk@gmail.com','Test Type: HbA1c Test, Diabetes Management Plan: daily one time rice two times green vegitables, Medications: paracetomal, Most Recent A1c Level: 200','Test Type: HbA1c Test; HbA1c Level: 176 % (Normal Range: <5.7%; Prediabetes: 5.7% - 6.4%; Diabetes: >6.5%)');

/*Table structure for table `staff` */

DROP TABLE IF EXISTS `staff`;

CREATE TABLE `staff` (
  `staff_id` int(50) NOT NULL auto_increment,
  `staff_name` varchar(50) default NULL,
  `email` varchar(50) default NULL,
  `password` varchar(50) default NULL,
  `phone` varchar(50) default NULL,
  `gender` varchar(50) default NULL,
  `dob` varchar(50) default NULL,
  `s_image` varchar(50) default NULL,
  `staff_type` varchar(50) default NULL,
  PRIMARY KEY  (`staff_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Data for the table `staff` */

insert  into `staff`(`staff_id`,`staff_name`,`email`,`password`,`phone`,`gender`,`dob`,`s_image`,`staff_type`) values (1,'sahith','sahith@gmail.com','sahith','8888999888','male',NULL,'images (4).jpg','Sample Collector'),(2,'raju','raju@gmail.com','raju','8887779908','male',NULL,'images (7).jpg','Analyst');

/*Table structure for table `tests` */

DROP TABLE IF EXISTS `tests`;

CREATE TABLE `tests` (
  `test_id` int(11) NOT NULL auto_increment,
  `user_id` varchar(50) default NULL,
  `test_type` varchar(50) default NULL,
  `sample_id` varchar(100) NOT NULL,
  `sample_status` varchar(50) default 'Pending',
  `review_status` varchar(50) default 'Pending',
  `result_status` varchar(50) default 'Pending',
  `result` text,
  PRIMARY KEY  (`test_id`),
  UNIQUE KEY `sample_id` (`sample_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*Data for the table `tests` */

insert  into `tests`(`test_id`,`user_id`,`test_type`,`sample_id`,`sample_status`,`review_status`,`result_status`,`result`) values (3,'sai@gmail.com','Blood Sugar Test','5ff8571a33','Collected','Submitted','Submitted','based on your reports your sugar levels are normal'),(4,'msk@gmail.com','HbA1c Test','9ba61dcd8b','Collected','Submitted','Submitted','based on your reports your A1c level decreased'),(5,'sai@gmail.com','Blood Sugar Test','73e16596ca','Collected','Submitted','Submitted','based on your sample your glucose level is normal');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `user_id` int(30) NOT NULL auto_increment,
  `user_name` varchar(50) default NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(20) default NULL,
  `phone` varchar(15) default NULL,
  `gender` varchar(10) default NULL,
  `dob` varchar(15) default NULL,
  `u_image` varchar(50) default NULL,
  PRIMARY KEY  (`user_id`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Data for the table `user` */

insert  into `user`(`user_id`,`user_name`,`email`,`password`,`phone`,`gender`,`dob`,`u_image`) values (1,'sai','sai@gmail.com','sai','9999888999','male','2000-04-07','images (4).jpg'),(3,'msk','msk@gmail.com','msk','8888777666','male','2000-09-09','testimonial-4.jpg');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
