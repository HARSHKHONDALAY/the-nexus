/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.4.5-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: bitnami_wordpress
-- ------------------------------------------------------
-- Server version	11.4.5-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `wp_chess_nexus_audit_log`
--

DROP TABLE IF EXISTS `wp_chess_nexus_audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `wp_chess_nexus_audit_log` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `event_key` varchar(120) NOT NULL DEFAULT '',
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `action_key` varchar(120) NOT NULL DEFAULT '',
  `action_label` varchar(255) NOT NULL DEFAULT '',
  `details_text` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_event_key` (`event_key`),
  KEY `idx_action_key` (`action_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wp_chess_nexus_audit_log`
--

LOCK TABLES `wp_chess_nexus_audit_log` WRITE;
/*!40000 ALTER TABLE `wp_chess_nexus_audit_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `wp_chess_nexus_audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wp_chess_nexus_event_meta`
--

DROP TABLE IF EXISTS `wp_chess_nexus_event_meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `wp_chess_nexus_event_meta` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `event_key` varchar(120) NOT NULL,
  `extra_expenses` decimal(12,2) NOT NULL DEFAULT 0.00,
  `updated_at` datetime NOT NULL,
  `registration_closed` tinyint(1) NOT NULL DEFAULT 0,
  `archived_to_past` tinyint(1) NOT NULL DEFAULT 0,
  `extra_expenses_comment` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_event_key` (`event_key`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wp_chess_nexus_event_meta`
--

LOCK TABLES `wp_chess_nexus_event_meta` WRITE;
/*!40000 ALTER TABLE `wp_chess_nexus_event_meta` DISABLE KEYS */;
INSERT INTO `wp_chess_nexus_event_meta` VALUES
(1,'checkmate-chaos-2026-03-28',100.00,'2026-04-02 12:40:23',1,1,''),
(2,'checkmate-chaos-2026-04-25',0.00,'2026-04-04 12:59:12',1,1,NULL),
(3,'checkmate-chill-2026-02-28',0.00,'2026-04-02 12:40:23',1,1,NULL),
(9,'checkmate-connect-2026-04-18',0.00,'2026-04-18 08:07:32',1,1,NULL),
(10,'checkmate-clash-2026-04-25',0.00,'2026-04-25 10:25:35',1,1,NULL),
(12,'checkmate-chaos-2026-05-23',0.00,'2026-04-30 16:06:24',0,0,NULL),
(13,'checkmate-chill-2026-05-30',0.00,'2026-04-30 16:07:31',0,0,NULL);
/*!40000 ALTER TABLE `wp_chess_nexus_event_meta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wp_chess_nexus_events`
--

DROP TABLE IF EXISTS `wp_chess_nexus_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `wp_chess_nexus_events` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `event_key` varchar(120) NOT NULL,
  `title` varchar(255) NOT NULL,
  `event_date` date NOT NULL,
  `date_label` varchar(50) NOT NULL,
  `time_label` varchar(100) NOT NULL,
  `venue` varchar(255) NOT NULL,
  `location_short` varchar(120) NOT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT 600.00,
  `venue_cost` decimal(12,2) NOT NULL DEFAULT 400.00,
  `max_seats` int(10) unsigned NOT NULL DEFAULT 30,
  `upi_id` varchar(150) NOT NULL DEFAULT '',
  `whatsapp_link` text DEFAULT NULL,
  `qr_image` text DEFAULT NULL,
  `logo` text DEFAULT NULL,
  `default_status` varchar(20) NOT NULL DEFAULT 'past',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_event_key` (`event_key`),
  KEY `idx_event_date` (`event_date`),
  KEY `idx_is_deleted` (`is_deleted`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wp_chess_nexus_events`
--

LOCK TABLES `wp_chess_nexus_events` WRITE;
/*!40000 ALTER TABLE `wp_chess_nexus_events` DISABLE KEYS */;
INSERT INTO `wp_chess_nexus_events` VALUES
(1,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','28/02/2026','01:00 to 03:00','CraftBar','Bandra',600.00,400.00,30,'Khushalnile06-1@okaxis','https://chat.whatsapp.com/FFFQ73MMhDk43xTr6muKFM?mode=hqctcli','https://polarisstudios.in/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-16-at-20.18.12.jpeg','https://polarisstudios.in/wp-content/uploads/2026/03/Screenshot_2026-03-16_at_8.19.03_PM-removebg-preview.png','current','2026-04-02 12:38:58','2026-04-02 12:38:58',0,NULL),
(7,'checkmate-connect-2026-04-18','Checkmate & Connect','2026-04-18','18/04/2026','12:00 to 02:00','Bustling Brew, Thane','Thane',600.00,315.00,25,'Khushalnile06-1@okaxis','https://chat.whatsapp.com/FFFQ73MMhDk43xTr6muKFM?mode=hqctcli','https://polarisstudios.in/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-16-at-20.18.12.jpeg','https://polarisstudios.in/wp-content/uploads/2026/03/Screenshot_2026-03-16_at_8.19.03_PM-removebg-preview.png','current','2026-04-04 14:15:35','2026-04-04 14:15:35',0,NULL),
(8,'checkmate-clash-2026-04-25','Checkmate & Clash','2026-04-25','25/04/2026','03:00 to 05:00','Coast & Bloom, Dadar','Dadar',600.00,400.00,25,'Khushalnile06-1@okaxis','https://chat.whatsapp.com/FFFQ73MMhDk43xTr6muKFM?mode=hqctcli','https://polarisstudios.in/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-16-at-20.18.12.jpeg','https://polarisstudios.in/wp-content/uploads/2026/03/Screenshot_2026-03-16_at_8.19.03_PM-removebg-preview.png','current','2026-04-04 14:16:49','2026-04-04 14:16:49',0,NULL),
(10,'checkmate-chaos-2026-05-23','Checkmate & Chaos','2026-05-23','23/05/2026','03:00PM TO 06:00PM','Coast & Bloom, Dadar','Dadar',600.00,400.00,22,'Khushalnile06-1@okaxis','https://chat.whatsapp.com/FFFQ73MMhDk43xTr6muKFM?mode=hqctcli','https://polarisstudios.in/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-16-at-20.18.12.jpeg','https://polarisstudios.in/wp-content/uploads/2026/03/Screenshot_2026-03-16_at_8.19.03_PM-removebg-preview.png','current','2026-04-30 16:06:24','2026-04-30 16:06:24',0,NULL),
(11,'checkmate-chill-2026-05-30','Checkmate & Chill','2026-05-30','30/05/2026','12:00pm TO 03:00pm','Bustling Brew, Thane','Thane',600.00,315.00,22,'Khushalnile06-1@okaxis','https://chat.whatsapp.com/FFFQ73MMhDk43xTr6muKFM?mode=hqctcli','https://polarisstudios.in/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-16-at-20.18.12.jpeg','https://polarisstudios.in/wp-content/uploads/2026/03/Screenshot_2026-03-16_at_8.19.03_PM-removebg-preview.png','current','2026-04-30 16:07:31','2026-04-30 16:07:31',0,NULL);
/*!40000 ALTER TABLE `wp_chess_nexus_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wp_chess_nexus_finance_adjustments`
--

DROP TABLE IF EXISTS `wp_chess_nexus_finance_adjustments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `wp_chess_nexus_finance_adjustments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `event_key` varchar(120) NOT NULL,
  `adjustment_section` varchar(50) NOT NULL DEFAULT 'expense',
  `adjustment_operator` varchar(10) NOT NULL DEFAULT 'add',
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `comment_text` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_event_key` (`event_key`),
  KEY `idx_section` (`adjustment_section`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wp_chess_nexus_finance_adjustments`
--

LOCK TABLES `wp_chess_nexus_finance_adjustments` WRITE;
/*!40000 ALTER TABLE `wp_chess_nexus_finance_adjustments` DISABLE KEYS */;
INSERT INTO `wp_chess_nexus_finance_adjustments` VALUES
(1,'checkmate-chaos-2026-04-25','revenue','add',11000.00,'','2026-04-02 12:15:43',NULL),
(3,'checkmate-chaos-2026-04-25','venue_cost','subtract',7750.00,'','2026-04-02 12:16:57',NULL),
(13,'checkmate-connect-2026-04-18','revenue','add',1898.00,'total','2026-04-23 10:14:52',NULL),
(14,'checkmate-connect-2026-04-18','venue_cost','add',2205.00,'venue cost','2026-04-23 10:15:44',NULL),
(15,'checkmate-connect-2026-04-18','expense','add',1487.00,'ads','2026-04-23 10:16:20',NULL),
(16,'checkmate-clash-2026-04-25','expense','add',350.00,'Discounted members','2026-04-25 18:07:27',NULL),
(17,'checkmate-clash-2026-04-25','expense','add',625.00,'Ads','2026-04-25 18:07:54',NULL),
(18,'checkmate-clash-2026-04-25','expense','add',500.00,'Shoot','2026-04-25 18:08:22',NULL),
(19,'checkmate-clash-2026-04-25','expense','add',36.00,'Book my show','2026-04-25 18:10:06',NULL);
/*!40000 ALTER TABLE `wp_chess_nexus_finance_adjustments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wp_chess_nexus_registrations`
--

DROP TABLE IF EXISTS `wp_chess_nexus_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `wp_chess_nexus_registrations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `contact_number` varchar(30) NOT NULL,
  `email` varchar(255) DEFAULT '',
  `instagram_id` varchar(255) DEFAULT '',
  `age` int(10) unsigned NOT NULL DEFAULT 0,
  `location_area` varchar(255) NOT NULL DEFAULT '',
  `occupation` varchar(255) NOT NULL DEFAULT '',
  `working_sector` varchar(255) DEFAULT '',
  `whatsapp_opt_in` varchar(20) NOT NULL DEFAULT '',
  `chess_level` varchar(100) NOT NULL DEFAULT '',
  `dietary_preference` varchar(100) NOT NULL DEFAULT '',
  `payment_screenshot_url` text DEFAULT '',
  `agreement_accepted` tinyint(1) NOT NULL DEFAULT 0,
  `submitted_at` datetime NOT NULL,
  `checked_in` tinyint(1) NOT NULL DEFAULT 0,
  `checked_in_at` datetime DEFAULT NULL,
  `event_key` varchar(120) NOT NULL DEFAULT '',
  `event_title` varchar(255) NOT NULL DEFAULT '',
  `event_date` date DEFAULT NULL,
  `event_time_label` varchar(100) NOT NULL DEFAULT '',
  `event_venue` varchar(255) NOT NULL DEFAULT '',
  `source_type` varchar(50) NOT NULL DEFAULT 'Website',
  `payment_status` varchar(20) NOT NULL DEFAULT 'pending',
  `attendee_note` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_event_key` (`event_key`),
  KEY `idx_event_date` (`event_date`),
  KEY `idx_checked_in` (`checked_in`),
  KEY `idx_source_type` (`source_type`),
  KEY `idx_contact_number` (`contact_number`),
  KEY `idx_payment_status` (`payment_status`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wp_chess_nexus_registrations`
--

LOCK TABLES `wp_chess_nexus_registrations` WRITE;
/*!40000 ALTER TABLE `wp_chess_nexus_registrations` DISABLE KEYS */;
INSERT INTO `wp_chess_nexus_registrations` VALUES
(4,'Manvith Y Shetty','7975703179','','@man_vith1',22,'Powai','Working Professional','IT / Software','Yes','Intermediate','Eggetarian','https://polarisstudios.in/wp-content/uploads/2026/03/1000120546.jpg',1,'2026-03-17 05:12:08',1,'2026-03-28 09:56:04','checkmate-chaos-2026-03-28','Checkmate & Chaos','2026-03-28','03:00 PM – 05:00 PM','Coast and Bloom, Dadar','Website','pending',NULL),
(5,'Ayush Singh','9136744223','','ayushsingh_1310',22,'Vikhroli','Working Professional','Banking / Finance','Yes','Intermediate','Non-Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/03/payment_confirmation_20260376-075906.png',1,'2026-03-17 14:29:34',1,'2026-03-28 09:56:18','checkmate-chaos-2026-03-28','Checkmate & Chaos','2026-03-28','03:00 PM – 05:00 PM','Coast and Bloom, Dadar','Website','pending',NULL),
(6,'Rishabh Rajput','8097409904','','Rishrajput',27,'Goregaon East','Working Professional','Banking / Finance','Yes','Intermediate','Non-Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/03/IMG_0283.png',1,'2026-03-19 08:14:59',1,'2026-03-28 09:52:48','checkmate-chaos-2026-03-28','Checkmate & Chaos','2026-03-28','03:00 PM – 05:00 PM','Coast and Bloom, Dadar','Website','pending',NULL),
(7,'Dixita Singh','7666304604','','Dixita.singh',28,'Goregaon East','Working Professional','Banking / Finance','Yes','Beginner','Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/03/IMG_0285.png',1,'2026-03-19 08:37:50',1,'2026-03-28 09:59:04','checkmate-chaos-2026-03-28','Checkmate & Chaos','2026-03-28','03:00 PM – 05:00 PM','Coast and Bloom, Dadar','Website','pending',NULL),
(8,'Prathamesh Shidhaye','9082582650','','pa_sh0903',24,'Bandra East','Student','','Yes','Advanced','Non-Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/03/12605.png',1,'2026-03-20 07:11:42',1,'2026-03-28 09:30:28','checkmate-chaos-2026-03-28','Checkmate & Chaos','2026-03-28','03:00 PM – 05:00 PM','Coast and Bloom, Dadar','Website','pending',NULL),
(13,'Vikas More','9763880092','','',33,'Ghansoli','Working Professional','Manufacturing / Industrial','Yes','Intermediate','Non-Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/03/Screenshot_20260323_104342_PhonePe.jpg',1,'2026-03-23 05:14:36',1,'2026-03-28 09:45:13','checkmate-chaos-2026-03-28','Checkmate & Chaos','2026-03-28','03:00 PM – 05:00 PM','Coast and Bloom, Dadar','Website','pending',NULL),
(14,'Pranay Bakshi','8898000232','','@pranaycosmic',29,'Kharghar','Freelancer','','Yes','Intermediate','Non-Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/03/1000192801.jpg',1,'2026-03-26 10:07:37',1,'2026-03-28 09:37:29','checkmate-chaos-2026-03-28','Checkmate & Chaos','2026-03-28','03:00 PM – 05:00 PM','Coast and Bloom, Dadar','Website','pending',NULL),
(15,'Khushi Fulsunge','9820937503','','',25,'Malad West','Looking for work','','No','Beginner','Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/03/1000192802.jpg',1,'2026-03-26 10:09:30',1,'2026-03-28 09:24:05','checkmate-chaos-2026-03-28','Checkmate & Chaos','2026-03-28','03:00 PM – 05:00 PM','Coast and Bloom, Dadar','Website','pending',NULL),
(16,'Snehal Gaikar','9820839932','','snehalgaikar24',39,'Dadar','Working Professional','Education / Teaching','Yes','Beginner','Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-27-at-4.57.04-PM.jpeg',1,'2026-03-27 11:27:43',1,'2026-03-28 09:33:26','checkmate-chaos-2026-03-28','Checkmate & Chaos','2026-03-28','03:00 PM – 05:00 PM','Coast and Bloom, Dadar','Website','pending',NULL),
(17,'lokesh natoo','9922002264','','ChessWithLokesh',39,'Vile Parle East','Working Professional','Other','Yes','Intermediate','Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/03/IMG_9088.png',1,'2026-03-27 11:45:34',1,'2026-03-28 09:32:50','checkmate-chaos-2026-03-28','Checkmate & Chaos','2026-03-28','03:00 PM – 05:00 PM','Coast and Bloom, Dadar','Website','pending',NULL),
(18,'Abhishek Patil','8828363246','','_abhishekkpatil_',20,'Kurla','Student','','Yes','Beginner','Eggetarian','https://polarisstudios.in/wp-content/uploads/2026/03/IMG-20260327-WA0016.jpg',1,'2026-03-27 13:41:07',1,'2026-03-28 09:59:43','checkmate-chaos-2026-03-28','Checkmate & Chaos','2026-03-28','03:00 PM – 05:00 PM','Coast and Bloom, Dadar','Website','pending',NULL),
(19,'Yashraj A Gorde','08424935649','','Yashraj_gorde',23,'Bandra East','Student','','Yes','Beginner','Non-Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/03/IMG_3946.png',1,'2026-03-27 14:29:49',1,'2026-03-28 09:59:52','checkmate-chaos-2026-03-28','Checkmate & Chaos','2026-03-28','03:00 PM – 05:00 PM','Coast and Bloom, Dadar','Website','pending',NULL),
(20,'Jai Goel','9987654285','','jaigoel09',23,'Dadar','Working Professional','Banking / Finance','Yes','Advanced','Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/03/91418.jpg',1,'2026-03-27 17:58:26',1,'2026-03-28 10:00:04','checkmate-chaos-2026-03-28','Checkmate & Chaos','2026-03-28','03:00 PM – 05:00 PM','Coast and Bloom, Dadar','Website','pending',NULL),
(22,'Amit','8169504156','','amit_b_patil',25,'Prabhadevi','Freelancer','','Yes','Beginner','Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/03/1000494125.png',1,'2026-03-28 10:04:38',1,'2026-03-28 10:40:36','checkmate-chaos-2026-03-28','Checkmate & Chaos','2026-03-28','03:00 PM – 05:00 PM','Coast and Bloom, Dadar','Website','pending',NULL),
(23,'Yash Mehta','9426871029','','',25,'Goregaon West','Working Professional','Banking / Finance','Yes','Intermediate','Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/03/1000175662.jpg',1,'2026-03-28 12:51:53',1,'2026-03-28 13:06:19','checkmate-chaos-2026-03-28','Checkmate & Chaos','2026-03-28','03:00 PM – 05:00 PM','Coast and Bloom, Dadar','Website','pending',NULL),
(29,'Aishwarya Abhijeet Pai','9000000001','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','Website','pending',NULL),
(30,'Dhanish Vinod Dhavle','9000000002','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','Website','pending',NULL),
(31,'Isheet Jain','9000000003','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','Website','pending',NULL),
(32,'Tarun Iyer','9000000004','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','Website','pending',NULL),
(33,'Yash Verma','9000000005','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','Website','pending',NULL),
(34,'Prakash Sitaram Morye','9000000006','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','Website','pending',NULL),
(35,'Abhishek Patil','9000000007','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','Website','pending',NULL),
(36,'Abhilash Jadhao','9000000008','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','Website','pending',NULL),
(37,'Kaustubh Salve','9000000009','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','Website','pending',NULL),
(38,'Sanjay bhat','9000000010','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','Website','pending',NULL),
(39,'Kartik A','9000000011','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','Website','pending',NULL),
(40,'Jeet Sadanshio','9000000012','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','Website','pending',NULL),
(41,'Aniket khot','9000000013','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','Website','pending',NULL),
(42,'Harsh Goyal','9000000014','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','Website','pending',NULL),
(43,'Kanaad Shetye','9000000015','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','Website','pending',NULL),
(44,'Yashraj gorde','9000000016','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','Website','pending',NULL),
(45,'Harsh Khondalay','9000000017','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','Website','pending',NULL),
(46,'Ayush(bms)','9000000018','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','BookMyShow','pending',NULL),
(47,'Siddhesh','9000000019','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','Website','pending',NULL),
(48,'khushal','9000000020','','',0,'','','','','','','',1,'2026-04-04 14:11:19',0,NULL,'checkmate-chill-2026-02-28','Checkmate & Chill','2026-02-28','01:00 to 03:00','CraftBar','Website','pending',NULL),
(54,'Abhishek Kamat','8652441636','','',26,'Andheri East','Working Professional','IT / Software','Yes','Intermediate','Non-Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/04/1000103510.jpg',1,'2026-04-12 04:29:52',1,'2026-04-25 09:46:55','checkmate-clash-2026-04-25','Checkmate & Clash','2026-04-25','03:00 to 05:00','Coast & Bloom, Dadar','Website','pending',NULL),
(56,'Sanket Bendre','9324147335','','sanket__0708',22,'Dadar','Student','','No','Intermediate','Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/04/1000301667.jpg',1,'2026-04-15 13:38:25',1,'2026-04-25 09:31:51','checkmate-clash-2026-04-25','Checkmate & Clash','2026-04-25','03:00 to 05:00','Coast & Bloom, Dadar','Website','pending',NULL),
(57,'Roshan Dsouza','8879040757','','dsouzarick25',43,'Other','Looking for work','Sales / Business Development','Yes','Advanced','Non-Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/04/Screenshot_2026-04-17-10-22-26-741_com.whatsapp-edit.jpg',1,'2026-04-17 04:54:27',1,'2026-04-18 07:23:42','checkmate-connect-2026-04-18','Checkmate & Connect','2026-04-18','12:00 to 02:00','Bustling Brew, Thane','Website','pending',NULL),
(58,'VIPUL KHAIRE','8268766516','','vipul_khaire',32,'Sion','Working Professional','Banking / Finance','Yes','Intermediate','Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/04/IMG_1647.png',1,'2026-04-17 17:40:27',1,'2026-04-18 06:44:38','checkmate-connect-2026-04-18','Checkmate & Connect','2026-04-18','12:00 to 02:00','Bustling Brew, Thane','Website','pending',NULL),
(59,'Shilpa naik','9819569375','','',0,'','','','','','','',1,'2026-04-18 08:09:06',1,'2026-04-18 08:09:06','checkmate-connect-2026-04-18','Checkmate & Connect','2026-04-18','12:00 to 02:00','Bustling Brew, Thane','BookMyShow','pending',NULL),
(60,'Rohit sajekar','8380854382','','',0,'','','','','','','',1,'2026-04-18 08:19:26',1,'2026-04-18 08:19:26','checkmate-connect-2026-04-18','Checkmate & Connect','2026-04-18','12:00 to 02:00','Bustling Brew, Thane','Walk-in','pending',NULL),
(61,'Danish dhavale','9326106401','','',0,'','','','','','','',1,'2026-04-23 10:12:42',1,'2026-04-23 10:12:42','checkmate-connect-2026-04-18','Checkmate & Connect','2026-04-18','12:00 to 02:00','Bustling Brew, Thane','Walk-in','pending',NULL),
(62,'swaraj pai','7400088782','','',0,'','','','','','','',1,'2026-04-23 10:13:15',1,'2026-04-23 10:13:15','checkmate-connect-2026-04-18','Checkmate & Connect','2026-04-18','12:00 to 02:00','Bustling Brew, Thane','Walk-in','pending',NULL),
(63,'Manish karan Sundram','9930527916','','iam.mks_',24,'Mahim','Working Professional','IT / Software','Yes','Intermediate','Eggetarian','https://polarisstudios.in/wp-content/uploads/2026/04/1000134681.jpg',1,'2026-04-23 16:25:43',1,'2026-04-25 09:43:53','checkmate-clash-2026-04-25','Checkmate & Clash','2026-04-25','03:00 to 05:00','Coast & Bloom, Dadar','Website','pending',NULL),
(64,'Jai Goel','9987654285','','jaigoel09',23,'Prabhadevi','Working Professional','Banking / Finance','Yes','Professional / Tournament Player','Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/04/99183.jpg',1,'2026-04-24 05:21:31',1,'2026-04-25 10:22:10','checkmate-clash-2026-04-25','Checkmate & Clash','2026-04-25','03:00 to 05:00','Coast & Bloom, Dadar','Website','pending',NULL),
(65,'Ojasee Duble','9821732664','','ojaseeduble',24,'Mahim','Other','','Yes','Beginner','Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/04/IMG_2164.png',1,'2026-04-24 08:15:23',1,'2026-04-25 09:31:37','checkmate-clash-2026-04-25','Checkmate & Clash','2026-04-25','03:00 to 05:00','Coast & Bloom, Dadar','Website','pending',NULL),
(66,'Sandip Sitaram Suryawanshi','8482851842','','',25,'Kopar Khairane','Working Professional','Other','Yes','Beginner','Non-Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/04/1000150312.jpg',1,'2026-04-24 09:59:08',1,'2026-04-25 09:15:30','checkmate-clash-2026-04-25','Checkmate & Clash','2026-04-25','03:00 to 05:00','Coast & Bloom, Dadar','Website','pending',NULL),
(67,'VIPUL KHAIRE','8268766516','','vipul_khaire',32,'Sion','Working Professional','Banking / Finance','Yes','Intermediate','Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/04/12620f0a-4cf1-49ad-8c58-d8182b46afd6.jpeg',1,'2026-04-24 17:27:04',1,'2026-04-25 09:48:31','checkmate-clash-2026-04-25','Checkmate & Clash','2026-04-25','03:00 to 05:00','Coast & Bloom, Dadar','Website','pending',NULL),
(68,'Soham Pokharkar','9082022195','','Sohhmuchmore',22,'Bhandup','Working Professional','Marketing / Advertising','Yes','Intermediate','Non-Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/04/inbound3488417797139994424.jpg',1,'2026-04-25 03:29:15',1,'2026-04-25 09:38:24','checkmate-clash-2026-04-25','Checkmate & Clash','2026-04-25','03:00 to 05:00','Coast & Bloom, Dadar','Website','pending',NULL),
(69,'Ankit Shah','8108104171','','mr.shah100@gmail.com',38,'Marine Lines','Business / Self-employed','Other','No','Beginner','Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/04/Screenshot_20260425_104557_WhatsApp.jpg',1,'2026-04-25 05:16:17',1,'2026-04-25 09:24:50','checkmate-clash-2026-04-25','Checkmate & Clash','2026-04-25','03:00 to 05:00','Coast & Bloom, Dadar','Website','pending',NULL),
(70,'Vallari Shah','7016407363','','',30,'Goregaon West','Working Professional','Design / Creative','Yes','Intermediate','Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/04/IMG_9961.png',1,'2026-04-25 05:23:42',1,'2026-04-25 09:55:42','checkmate-clash-2026-04-25','Checkmate & Clash','2026-04-25','03:00 to 05:00','Coast & Bloom, Dadar','Website','pending',NULL),
(71,'Samaksh Chhabra','07767942420','','',34,'Chembur','Working Professional','Banking / Finance','Yes','Intermediate','Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/04/1000196192.jpg',1,'2026-04-25 06:22:11',1,'2026-04-25 09:24:00','checkmate-clash-2026-04-25','Checkmate & Clash','2026-04-25','03:00 to 05:00','Coast & Bloom, Dadar','Website','pending',NULL),
(72,'Varun Poduval','9920906440','','varunpoduval',31,'Bandra East','Working Professional','Banking / Finance','Yes','Intermediate','Non-Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/04/1000581658.png',1,'2026-04-25 06:39:20',1,'2026-04-25 09:23:28','checkmate-clash-2026-04-25','Checkmate & Clash','2026-04-25','03:00 to 05:00','Coast & Bloom, Dadar','Website','pending',NULL),
(73,'Yash Mehta','9426871029','','',25,'Andheri East','Working Professional','Banking / Finance','Yes','Intermediate','Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/04/1000185451.jpg',1,'2026-04-25 07:20:19',1,'2026-04-25 09:27:14','checkmate-clash-2026-04-25','Checkmate & Clash','2026-04-25','03:00 to 05:00','Coast & Bloom, Dadar','Website','pending',NULL),
(74,'Palash Tailor','9869448350','','',15,'Borivali West','Student','','Yes','Beginner','Non-Vegetarian','https://polarisstudios.in/wp-content/uploads/2026/04/1000031394.jpg',1,'2026-04-25 09:28:16',1,'2026-04-25 09:33:15','checkmate-clash-2026-04-25','Checkmate & Clash','2026-04-25','03:00 to 05:00','Coast & Bloom, Dadar','Website','pending',NULL),
(75,'Parag lokur','9145036470','','',0,'','','','','','','',1,'2026-04-25 10:26:18',1,'2026-04-25 10:26:18','checkmate-clash-2026-04-25','Checkmate & Clash','2026-04-25','03:00 to 05:00','Coast & Bloom, Dadar','BookMyShow','pending',NULL),
(76,'matures patwardhan','8275252499','','',0,'','','','','','','',1,'2026-04-25 10:27:11',1,'2026-04-25 10:27:11','checkmate-clash-2026-04-25','Checkmate & Clash','2026-04-25','03:00 to 05:00','Coast & Bloom, Dadar','BookMyShow','pending',NULL),
(77,'Sandip bhosale','9820943101','','',0,'','','','','','','',1,'2026-04-25 10:59:17',1,'2026-04-25 10:59:17','checkmate-clash-2026-04-25','Checkmate & Clash','2026-04-25','03:00 to 05:00','Coast & Bloom, Dadar','BookMyShow','pending',NULL);
/*!40000 ALTER TABLE `wp_chess_nexus_registrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-05-07 14:41:34
