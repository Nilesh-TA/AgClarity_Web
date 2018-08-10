CREATE DATABASE  IF NOT EXISTS `agclarity` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `agclarity`;
-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: agclarity
-- ------------------------------------------------------
-- Server version	5.7.16-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `address` (
  `ID_address` bigint(20) NOT NULL AUTO_INCREMENT,
  `address_1` varchar(2000) NOT NULL,
  `address_2` varchar(2000) DEFAULT NULL,
  `city` varchar(2000) DEFAULT NULL,
  `state` varchar(2000) DEFAULT NULL,
  `postal_code` varchar(2000) DEFAULT NULL,
  `country` varchar(2000) DEFAULT NULL,
  `company` bigint(20) DEFAULT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_address`),
  KEY `idx_Address_isdeleted` (`isdeleted`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES (1,'1234 Elm St','','Easton','CA','90192','United States of America (USA)',1,NULL,NULL),(2,'356 Maple St','','Parkwood','CA','93033','United States of America (USA)',1,NULL,NULL),(3,'8873 Tadah Ct','Bldg C','Kingman','AZ','','United States of America (USA)',5,NULL,NULL),(4,'3844 Apple Valley Rd','DC-A23','Victorville','CA','','United States of America (USA)',1,NULL,NULL),(5,'Test Mailing Address','Optional Address 2','NewYork','Atlanta','90024','United States of America (USA)',1,NULL,NULL),(6,'334, Radhe Square,','Kudasan','Gandhinagar','Gujarat','382421','India',1,NULL,NULL),(7,'Infocity','Infocity Circle 1','Gandhinagar','Gujarat','382420','India',1,'','2018-08-08 16:15:45'),(8,'MA 1','A2','C1','S1','985825','Canada',1,NULL,NULL),(9,'MA 2','A 21','C2','S2','725125','Saudi Arabia',1,NULL,NULL);
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alert_message`
--

DROP TABLE IF EXISTS `alert_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alert_message` (
  `ID_alert_message` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `location` bigint(20) NOT NULL,
  `message` varchar(2000) NOT NULL,
  `delivery_type` varchar(500) NOT NULL,
  `delivered_to` varchar(500) NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`ID_alert_message`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alert_message`
--

LOCK TABLES `alert_message` WRITE;
/*!40000 ALTER TABLE `alert_message` DISABLE KEYS */;
/*!40000 ALTER TABLE `alert_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chemical`
--

DROP TABLE IF EXISTS `chemical`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chemical` (
  `ID_chemical` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `hazardous` varchar(255) DEFAULT NULL,
  `application` varchar(255) DEFAULT NULL,
  `water` varchar(255) DEFAULT NULL,
  `spread` varchar(255) DEFAULT NULL,
  `severity` varchar(500) DEFAULT NULL,
  `symptoms` varchar(2000) DEFAULT NULL,
  `prevention` varchar(500) DEFAULT NULL,
  `remedy` varchar(500) DEFAULT NULL,
  `company` bigint(20) DEFAULT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_chemical`),
  KEY `idx_chemical_isdeleted` (`isdeleted`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chemical`
--

LOCK TABLES `chemical` WRITE;
/*!40000 ALTER TABLE `chemical` DISABLE KEYS */;
INSERT INTO `chemical` VALUES (1,'Roundup','weed killer','Herbacide',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL),(2,'Bug-Off','fruit fly killer','Insecticide',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL),(3,'Orange Crush','Sugarcane Orange Rust remover','Fungicide',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL),(4,'Max-Growth','plant growth regulators','PGR',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL),(5,'Test Chemical 1','Test Description 58','PGR',NULL,NULL,NULL,'test speread','123456','symptoms test','prev test','N/A',2,NULL,NULL),(6,'Test Chemical 2','Chemical Description 2','PGR',NULL,NULL,NULL,'t44t','1','1','1','1',3,NULL,NULL),(7,'Test Chemical 3','test','Fungicide',NULL,NULL,NULL,'2','2','2','2','2',4,'','2018-07-16 18:49:45'),(8,'Test Chemical 4','test`','Fungicide',NULL,NULL,NULL,'1','1','12','12','15',5,'','2018-07-16 16:51:42'),(9,'Test Chemical 4','no','Herbacide',NULL,NULL,NULL,'2','25','15','258','2',5,NULL,NULL),(10,'Test Chemical 4','test','Fungicide',NULL,NULL,NULL,'2','1','5','3','566u',4,NULL,NULL),(11,'Test Chemical 5','t44y','Fungicide',NULL,NULL,NULL,'54y5','4t54','h5y','4y54y','4y54y',4,NULL,NULL);
/*!40000 ALTER TABLE `chemical` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chemicalaction`
--

DROP TABLE IF EXISTS `chemicalaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chemicalaction` (
  `ID_chemicalAction` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `type` varchar(255) NOT NULL,
  `description` varchar(2000) NOT NULL,
  `application_set_point` varchar(500) NOT NULL,
  `NFPA_Hazard_ID` varchar(500) NOT NULL,
  `restrictions` varchar(500) NOT NULL,
  `half_life` int(11) NOT NULL,
  PRIMARY KEY (`ID_chemicalAction`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chemicalaction`
--

LOCK TABLES `chemicalaction` WRITE;
/*!40000 ALTER TABLE `chemicalaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `chemicalaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chemicals_transactions`
--

DROP TABLE IF EXISTS `chemicals_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chemicals_transactions` (
  `ID_chemicals` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `location` bigint(20) NOT NULL,
  `action_date` date NOT NULL,
  `action_taken` varchar(500) NOT NULL,
  PRIMARY KEY (`ID_chemicals`),
  KEY `Chemicals_transactions_fk0` (`location`),
  CONSTRAINT `Chemicals_transactions_fk0` FOREIGN KEY (`location`) REFERENCES `location` (`ID_location`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chemicals_transactions`
--

LOCK TABLES `chemicals_transactions` WRITE;
/*!40000 ALTER TABLE `chemicals_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `chemicals_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `company` (
  `ID_company` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `metric_imperial` char(1) NOT NULL,
  `currency` varchar(100) NOT NULL,
  `dunsnumber` varchar(100) DEFAULT NULL,
  `related_to` bigint(20) DEFAULT NULL,
  `rank` bigint(20) DEFAULT NULL,
  `address_1` varchar(2000) DEFAULT NULL,
  `address_2` varchar(2000) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `postal_code` varchar(100) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `water_saved` double DEFAULT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_company`),
  KEY `idx_company_isdeleted` (`isdeleted`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES (1,'North American Ag','I','USD','',5,NULL,'123 Lake St','','Minneapolis','MN','55408','USA',1201029,NULL,NULL),(2,'World Ag','M','EUR','',5,0,'Uhuru Hwy','','Nairobi','','00200','Kenya',401876,NULL,NULL),(3,'ASEAN Ag','M','USD','',5,NULL,'','','Bangkok','','10100','Thailand',NULL,NULL,NULL),(4,'South American Ag','M','USD','',5,NULL,'','','São Paulo','','','Brazil',6443567,NULL,NULL),(5,'Agrisource Data','I','USD','',NULL,NULL,'1000 Northfield Ct','Suite 110','Atlanta','GA','30072','USA',NULL,NULL,NULL),(8,'Test Company 1','M','BRL','123456',3,1,'test mailing address 123','','Columbus','Atlanta','90024','United States of America (USA)',0,'','2018-07-11 12:07:19'),(9,'Test Company 1','I','EUR','12345',3,1,'test ','1234','Columbus','Atlanta','90024','United States of America (USA)',12315,'','2018-07-16 18:49:28'),(10,'Test ASEAN Ag Company','I','USD','12385',3,4,'testt4t4','t4t4','Columbus','Atlanta','90024','United States of America (USA)',1547,NULL,NULL);
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companyaccess`
--

DROP TABLE IF EXISTS `companyaccess`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `companyaccess` (
  `ID_company_access` bigint(20) NOT NULL AUTO_INCREMENT,
  `contactProfileID` bigint(20) NOT NULL,
  `company` bigint(20) NOT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_company_access`),
  KEY `idx_companyaccess_isdeleted` (`isdeleted`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companyaccess`
--

LOCK TABLES `companyaccess` WRITE;
/*!40000 ALTER TABLE `companyaccess` DISABLE KEYS */;
INSERT INTO `companyaccess` VALUES (10,1,1,NULL,NULL),(11,2,1,NULL,NULL),(12,2,2,NULL,NULL),(13,2,3,NULL,NULL),(14,2,4,NULL,NULL),(15,2,5,NULL,NULL),(16,5,1,NULL,NULL),(17,5,2,NULL,NULL),(18,5,3,NULL,NULL),(19,5,4,NULL,NULL),(20,5,5,NULL,NULL),(21,22,5,NULL,NULL),(22,22,1,'','2018-07-26 17:07:48'),(23,22,4,NULL,NULL),(24,22,1,NULL,NULL),(26,20,1,NULL,NULL),(27,11,5,NULL,NULL),(28,11,3,NULL,NULL),(29,22,3,'','2018-08-02 12:32:10');
/*!40000 ALTER TABLE `companyaccess` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contactaccess`
--

DROP TABLE IF EXISTS `contactaccess`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contactaccess` (
  `id_contact_access` bigint(20) NOT NULL AUTO_INCREMENT,
  `contactprofileid` bigint(20) DEFAULT NULL,
  `company` bigint(20) DEFAULT NULL,
  `micro_apps` varchar(500) DEFAULT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  PRIMARY KEY (`id_contact_access`),
  KEY `idx_contactaccess_isdeleted` (`isdeleted`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contactaccess`
--

LOCK TABLES `contactaccess` WRITE;
/*!40000 ALTER TABLE `contactaccess` DISABLE KEYS */;
INSERT INTO `contactaccess` VALUES (1,1,1,'AgClarity Platform',NULL,NULL),(2,1,1,'Crop Health',NULL,NULL),(3,1,1,'Water Management',NULL,NULL),(4,1,1,'Y3',NULL,NULL),(5,1,1,'Reporting & Analytics',NULL,NULL),(6,2,1,'AgClarity Platform',NULL,NULL),(7,5,2,'AgClarity Platform',NULL,NULL),(12,5,1,'AgClarity Platform',NULL,NULL),(13,5,3,'AgClarity Platform',NULL,NULL),(14,5,4,'AgClarity Platform',NULL,NULL),(15,5,5,'AgClarity Platform',NULL,NULL),(17,2,2,'AgClarity Platform',NULL,NULL),(18,2,3,'AgClarity Platform',NULL,NULL),(19,2,4,'AgClarity Platform',NULL,NULL),(20,2,5,'AgClarity Platform',NULL,NULL),(21,22,5,'Administration',NULL,NULL),(22,22,5,'AgClarity Administration',NULL,NULL),(23,22,5,'AgClarity Platform',NULL,NULL),(24,22,5,'ASD Administration',NULL,NULL),(25,22,3,'Calendar','','2018-07-27 18:09:56'),(26,22,3,'Crop Health','','2018-07-27 18:09:56'),(27,22,3,'AgClarity Platform','','2018-07-27 18:09:56'),(28,22,3,'Reporting & Analytics','','2018-07-27 18:09:56'),(29,22,3,'Scouting',NULL,NULL),(30,22,1,'AgClarity Platform',NULL,NULL),(31,22,1,'Reporting & Analytics',NULL,NULL),(32,22,1,'Scouting',NULL,NULL),(33,22,1,'User Authentation',NULL,NULL),(34,22,5,'Data Integration',NULL,NULL),(35,22,5,'Reporting & Analytics',NULL,NULL),(36,22,3,'Data Integration',NULL,NULL),(37,22,3,'User Authentation',NULL,NULL),(38,22,3,'Water Management','','2018-07-27 19:37:46'),(39,22,3,'Weather','','2018-07-27 19:37:57'),(40,22,2,'Administration',NULL,NULL),(41,22,2,'AgClarity Administration',NULL,NULL),(42,11,5,'Administration',NULL,NULL),(43,11,5,'AgClarity Administration',NULL,NULL),(44,11,5,'AgClarity Platform',NULL,NULL),(45,11,5,'ASD Administration',NULL,NULL),(46,11,5,'Crop Health',NULL,NULL),(47,11,5,'Y3',NULL,NULL),(48,11,3,'Administration',NULL,NULL),(49,11,3,'AgClarity Administration',NULL,NULL),(50,11,3,'AgClarity Platform',NULL,NULL),(51,11,3,'ASD Administration',NULL,NULL),(52,11,3,'ATR',NULL,NULL),(53,11,3,'Calendar',NULL,NULL),(54,11,3,'Crop Health',NULL,NULL),(55,11,3,'Data Integration',NULL,NULL),(56,11,3,'Reporting & Analytics',NULL,NULL),(57,11,3,'Scouting',NULL,NULL),(58,11,3,'User Authentation',NULL,NULL),(59,11,3,'Water Management',NULL,NULL),(60,11,3,'Weather',NULL,NULL),(61,11,3,'Y3',NULL,NULL);
/*!40000 ALTER TABLE `contactaccess` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contactgroup`
--

DROP TABLE IF EXISTS `contactgroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contactgroup` (
  `ID_contact_group` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_ID` bigint(20) NOT NULL,
  `member` bigint(20) NOT NULL,
  PRIMARY KEY (`ID_contact_group`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contactgroup`
--

LOCK TABLES `contactgroup` WRITE;
/*!40000 ALTER TABLE `contactgroup` DISABLE KEYS */;
INSERT INTO `contactgroup` VALUES (1,1,1),(2,1,2),(3,2,6),(4,2,7),(5,2,8),(6,2,9),(7,2,10),(8,2,11);
/*!40000 ALTER TABLE `contactgroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contactprofile`
--

DROP TABLE IF EXISTS `contactprofile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contactprofile` (
  `ID_profile` bigint(20) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `responsibility_level` varchar(255) DEFAULT NULL,
  `preferred_contact_method` varchar(255) NOT NULL,
  `secondary_contact_method` varchar(255) DEFAULT NULL,
  `address_1` varchar(2000) DEFAULT NULL,
  `address_2` varchar(2000) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `company` bigint(20) DEFAULT NULL,
  `type` bigint(20) DEFAULT NULL,
  `access_role` varchar(255) NOT NULL,
  `language` varchar(500) DEFAULT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_profile`),
  KEY `ContactProfile_fk0` (`company`),
  KEY `idx_contactprofile_isdeleted` (`isdeleted`),
  CONSTRAINT `ContactProfile_fk0` FOREIGN KEY (`company`) REFERENCES `company` (`ID_company`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contactprofile`
--

LOCK TABLES `contactprofile` WRITE;
/*!40000 ALTER TABLE `contactprofile` DISABLE KEYS */;
INSERT INTO `contactprofile` VALUES (1,'Sarah','Maxwell','CEO','executive','email','','','','Minneapolis','MN','55408','US',1,NULL,'Management','English',NULL,NULL),(2,'John','Tulsa','Agronomist','agronomist','Phone','email','','','Henderson','MN','56044','United States of America (USA)',1,NULL,'Administrator','English',NULL,NULL),(3,'Marta','Jhally','Farm Manager','farm manager','Text','email','','','Nairobi','','00200','Kenya',2,NULL,'Administrator','English',NULL,NULL),(4,'Nick','Gathegi','Consultant','executive','email','text','','','Nairobi','','00200','Kenya',2,NULL,'Expert - External','English',NULL,NULL),(5,'John','Doe','Admin','executive','email','text','1000 Northfield Ct','Suite 110','Atlanta','GA','30072','USA',5,NULL,'AgrisourceData Admin','English',NULL,NULL),(6,'Ben','Worley','CEO','executive','email','text','1000 Northfield Ct','Suite 110','Atlanta','GA','30072','USA',5,NULL,'AgrisourceData Admin','English',NULL,NULL),(7,'Jordan','Reilly','VP, Sales','farm manager','email','text','1000 Northfield Ct','Suite 110','Atlanta','GA','30072','USA',5,NULL,'AgrisourceData Expert','English',NULL,NULL),(8,'Dave','Barre','Chief Agronomist','agronomist','email','text','1000 Northfield Ct','Suite 110','Atlanta','GA','30072','USA',5,NULL,'AgrisourceData Expert','English',NULL,NULL),(9,'Ahmed','Mahgoub','Chief Engieer','executive','email','text','1000 Northfield Ct','Suite 110','Atlanta','GA','30072','USA',5,NULL,'AgrisourceData Expert','English',NULL,NULL),(10,'Ramy','Farid','Developer','','text','phone','','','Cairo','','','Egypt',5,NULL,'AgrisourceData Admin','English',NULL,NULL),(11,'Steve','Strout','COO','Executive','email','text','1000 Northfield Ct','Suite 110','Atlanta','GA','30072','United States of America (USA)',5,NULL,'Agrisource Data Admin','English',NULL,NULL),(12,'Miguel','Mayo','CEO','executive','email','text','','','','','','',4,NULL,'Administrator','English',NULL,NULL),(13,'Pablo','Suarez','Farm Manager','farm manager','text','phone','','','','','','',4,NULL,'Expert - Internal','English',NULL,NULL),(14,'Aroon','Bidaya','Farm Manager','farm manager','text','phone','','','Bangkok','','10100','Thailand',3,NULL,'Administrator','English',NULL,NULL),(15,'Daw','Cook','agronomist','agronomist','email','text','','','Bangkok','','10100','Thailand',3,NULL,'Expert - External','English',NULL,NULL),(20,'Edvard','Halupa','Manager','Agronomist','email','Phone','test','test','Columbus','Atlanta','90024','United States of America (USA)',1,NULL,'Agrisource Data Admin','English',NULL,NULL),(22,'Peter','Rob','Manager','Accounts Payable','email','Phone','test 123','test','NewYork','Atlanta','90024','United States of America (USA)',5,NULL,'Administrator','English',NULL,NULL);
/*!40000 ALTER TABLE `contactprofile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crop`
--

DROP TABLE IF EXISTS `crop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crop` (
  `ID_crop` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `variety_name` varchar(255) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `avg_yield_acre` double DEFAULT NULL,
  `avg_size` double DEFAULT NULL,
  `avg_color` varchar(255) DEFAULT NULL,
  `maturity_cycle` varchar(255) DEFAULT NULL,
  `crop_cycle` varchar(255) DEFAULT NULL,
  `crop_season` varchar(255) DEFAULT NULL,
  `kc_init` double DEFAULT NULL,
  `kc_mid` double DEFAULT NULL,
  `kc_end` double DEFAULT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  `company` bigint(20) DEFAULT NULL,
  `stage_1` varchar(1000) DEFAULT NULL,
  `stage_2` varchar(1000) DEFAULT NULL,
  `stage_3` varchar(1000) DEFAULT NULL,
  `stage_4` varchar(1000) DEFAULT NULL,
  `stage_5` varchar(1000) DEFAULT NULL,
  `stage_6` varchar(1000) DEFAULT NULL,
  `stage_7` varchar(1000) DEFAULT NULL,
  `stage_8` varchar(1000) DEFAULT NULL,
  `stage_9` varchar(1000) DEFAULT NULL,
  `stage_10` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`ID_crop`),
  KEY `idx_crop_isdeleted` (`isdeleted`)
) ENGINE=InnoDB AUTO_INCREMENT=258 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crop`
--

LOCK TABLES `crop` WRITE;
/*!40000 ALTER TABLE `crop` DISABLE KEYS */;
INSERT INTO `crop` VALUES (1,'Acacia',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,'Almond',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,'Apple','Ambrosia',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,'Apple','Ashmead\'s Kernel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,'Apple','Baldwin',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,'Apple','Ben Davis',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,'Apple','Braeburn',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,'Apple','Cameo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,'Apple','Cortland',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,'Apple','Cosmic Crisp',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(22,'Apple','Cripps Pink',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(23,'Apple','Elstar',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24,'Apple','Empire',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(25,'Apple','Esopus Spitzenburg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(26,'Apple','Fiesta',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(27,'Apple','Fuji',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(28,'Apple','Gala',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(29,'Apple','Ginger Gold',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(30,'Apple','Golden Delicious',NULL,NULL,NULL,NULL,'yellow',NULL,'Perennial',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(31,'Apple','Golden Russet',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(32,'Apple','Granny Smith',NULL,NULL,NULL,NULL,'green',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(33,'Apple','Gravenstein',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(34,'Apple','HoneyCrisp',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(35,'Apple','Jazz',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(36,'Apple','Jonagold',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(37,'Apple','Jonathan',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(38,'Apple','Kanzi',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(39,'Apple','Lady Alice',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(40,'Apple','Liberty',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(41,'Apple','Lodi',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(42,'Apple','McIntosh',NULL,NULL,NULL,NULL,'red',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(43,'Apple','Melrose',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(44,'Apple','Northern Spy',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(45,'Apple','Red Delicous',NULL,NULL,NULL,NULL,'red',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(46,'Apple','Ribston Pippin',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(47,'Apple','Rome',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(48,'Apple','Spartan','test','Fruits',95,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(49,'Apple','Stayman','test','Nuts',85,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(50,'Apple','Winesap','Desc. Apple Winesap','Fruits',25,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(51,'Apple','Wolf River',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(52,'Apricot',NULL,NULL,NULL,NULL,NULL,'orange','5,6,7,8',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(53,'Artichoke',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(54,'Asparagus','Apollo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(55,'Asparagus','Connovers Colossal',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(56,'Asparagus','Crimson Pacific',NULL,NULL,NULL,NULL,'purple',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(57,'Asparagus','De Paoli',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(58,'Asparagus','Grande',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(59,'Asparagus','Jersey Giant',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(60,'Asparagus','Mary Washington',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(61,'Asparagus','Millennium',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(62,'Asparagus','Pacific 2000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(63,'Asparagus','Purple Pacific',NULL,NULL,NULL,NULL,'purple',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(64,'Asparagus','Purple Passion',NULL,NULL,NULL,NULL,'purple',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(65,'Asparagus','Tiessen',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(66,'Asparagus','Violetto d\'Albenga',NULL,NULL,NULL,NULL,'purple',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(67,'Avocado',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(68,'Bananas','Apple',NULL,NULL,NULL,NULL,NULL,NULL,'Perennial',NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(69,'Bananas','Cavendish',NULL,NULL,NULL,NULL,'green to yellow to brown',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(70,'Bananas','Cooking',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(71,'Bananas','Lady Finger',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(72,'Bananas','Pisang Raja',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(73,'Bananas','Red',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(74,'Barley',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(75,'Basil',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(76,'Bean',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(77,'Beet Greens',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(78,'Beet, Sugar',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(79,'Beetroot',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(80,'Bell Pepper',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(81,'Berry, Blackberry','Marionberry',NULL,NULL,NULL,NULL,NULL,'5,6,7',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(82,'Berry, Blueberries',NULL,NULL,NULL,NULL,NULL,NULL,'6,7,8',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(83,'Berry, Boysenberry',NULL,NULL,NULL,NULL,0,'reddish to dark purple',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(84,'Berry, Cranberries',NULL,NULL,NULL,NULL,NULL,NULL,'9,10,11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(85,'Berry, Dewberries',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(86,'Berry, Elderberry',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(87,'Berry, Gooseberries',NULL,NULL,NULL,NULL,NULL,NULL,'7,8,9',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(88,'Berry, Gooseberry',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(89,'Berry, Huckleberries',NULL,NULL,NULL,NULL,NULL,NULL,'8,9',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(90,'Berry, Lingonberry',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(91,'Berry, Loganberry',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(92,'Berry, Mulberry',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(93,'Berry, Olallieberry',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(94,'Berry, Salmonberries',NULL,NULL,NULL,NULL,NULL,NULL,'7,8',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(95,'Berry, Saskatoon Berries',NULL,NULL,NULL,NULL,NULL,NULL,'7,8',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(96,'Berry, Strawberry','Amelia',NULL,NULL,NULL,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(97,'Berry, Strawberry','Annapolis',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(98,'Berry, Strawberry','Blanc Amélioré',NULL,NULL,NULL,NULL,'white',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(99,'Berry, Strawberry','California Special',NULL,NULL,NULL,NULL,NULL,'4,5,6,7','Annual',NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(100,'Berry, Strawberry','Clancy',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(101,'Berry, Strawberry','Earliglow',NULL,NULL,NULL,NULL,NULL,'6',NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(102,'Berry, Strawberry','Florida Radiance',NULL,NULL,NULL,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(103,'Berry, Strawberry','Galletta',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(104,'Berry, Strawberry','Honeoye',NULL,NULL,NULL,NULL,NULL,'6',NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(105,'Berry, Strawberry','Jordan Reserve',NULL,NULL,NULL,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(106,'Berry, Strawberry','Ozark Beauty',NULL,NULL,NULL,NULL,'red',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(107,'Berry, Strawberry','Strawberry Festival',NULL,NULL,NULL,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(108,'Bock Choy',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(109,'Broccoli',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(110,'Brussels Sprouts',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(111,'Cabbage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(112,'Cantaloupe',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(113,'Carob',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(114,'Carrot',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(115,'Cashew',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(116,'Cassava',NULL,NULL,NULL,31,NULL,NULL,NULL,'Perennial',NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(117,'Cauliflower',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(118,'Celery',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(119,'Chard',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(120,'Cherry',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(121,'Chestnut',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(122,'Chick-Peas',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(123,'Chicory',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(124,'Chives',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(125,'Clementine',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(126,'Clover',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(127,'Cocoa Beans',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Perennial',NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(128,'Coconuts',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Perennial',NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(129,'Coffee bean',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Perennial',NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(130,'Coriander',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(131,'Corn',NULL,NULL,NULL,13,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(132,'Cotton',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(133,'Cowpea (aka Black eyed Peas)',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(134,'Cucumber',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(135,'Currant',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(136,'Date',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(137,'Dill',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(138,'Eggplant',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(139,'Endives',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(140,'Eucalyptus',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(141,'Fennel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(142,'Fig',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(143,'Filbert',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(144,'Flax',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(145,'Garlic',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(146,'Ginger',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(147,'Grape, Table','CA-Red Globe','CA red table grape',NULL,10,NULL,NULL,'5,6,7,8,9','Annual',NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(148,'Grape, Wine',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Perennial',NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(149,'Grapefruit',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(150,'Greens, Beet',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(151,'Greens, Collard',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(152,'Greens, Mustard',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(153,'Hazelnuts',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(154,'Hemp',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(155,'Hops',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(156,'Kale',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(157,'Kiwi',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(158,'Kumquats',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(159,'Leek',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(160,'Legum',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(161,'Lemon',NULL,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(162,'Lentil',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(163,'Lettuce',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(164,'Lime',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(165,'Linseed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(166,'Loquat',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(167,'Macadamia Nut',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(168,'Mandarin','Clementine',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(169,'Mandarin','Encore',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(170,'Mandarin','Honey Murcott',NULL,NULL,7,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(171,'Mandarin','Tangerine',NULL,'Nuts',7,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(172,'Mango',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(173,'Melon',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(174,'Millet',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(175,'Mint',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(176,'Mushroom',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(177,'Nectarine',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(178,'Oat',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(179,'Oil Palm Fruit',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Perennial',NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(180,'Okra',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(181,'Olive',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Perennial',NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(182,'Onion',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(183,'Orange',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(184,'Oregano',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(185,'Papaya',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(186,'Parsley',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(187,'Parsnip',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(188,'Passion Fruit',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(189,'Peach',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(190,'Peanut',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(191,'Pear','Barlett',NULL,NULL,NULL,NULL,'green to yellow','8,9,10,11,12,1,2',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(192,'Pear','Bosc',NULL,NULL,NULL,NULL,'cinnamon brown with russeting','9,10,11,12,1,2,3,4',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(193,'Pear','Comice',NULL,NULL,NULL,NULL,'green to some red to all red','9,10,11,12,1,2',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(194,'Pear','Concorde',NULL,NULL,NULL,NULL,'yellow/green','9,10,11,12',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(195,'Pear','Forelle',NULL,NULL,NULL,NULL,'red/yellow','9.10,11,12,1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(196,'Pear','Green Anjou',NULL,NULL,NULL,NULL,'bright green, sometimes soft red','9,10,11,12,1,2,3,4,5,6,7',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(197,'Pear','Red Barlett',NULL,NULL,NULL,NULL,'dark red to bright red','8,9,10,11,12',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(198,'Pear','Sekel',NULL,NULL,NULL,NULL,'olive green to dark maroon','9,10,11,12,1,2',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(199,'Pear','Starkrimson',NULL,NULL,NULL,NULL,'Crimson Red','8,9,10,11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(200,'Peas','Sweet',NULL,NULL,NULL,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(201,'Peas','Snowbird (Snow)',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(202,'Peas','Sugar Ann (Snap)',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(203,'Peas','Green Arrow (Garden)',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(204,'Pecan',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(205,'Pepper',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(206,'Persimmon',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(207,'Pineapple',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(208,'Pistachio Nut',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(209,'Plantains',NULL,NULL,NULL,16,NULL,NULL,NULL,'Perennial',NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(210,'Plum',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(211,'Pomergranate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(212,'Poppyseed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(213,'Potato',NULL,NULL,NULL,43,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(214,'Prune',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(215,'Pumpkin',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(216,'Quince',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(217,'Radish',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(218,'Rapeseed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(219,'Raspberry',NULL,NULL,NULL,NULL,NULL,NULL,'6,7,8',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(220,'Rhubarb',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(221,'Rice',NULL,NULL,NULL,11,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(222,'Rutabaga',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(223,'Rye',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(224,'Safflower',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(225,'Sage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(226,'Sesame',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(227,'Shallot',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(228,'Snow Peas',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(229,'Sorghum',NULL,NULL,NULL,4,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(230,'Soybeans',NULL,NULL,NULL,6,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(231,'Spinach','Giant Nobel',NULL,NULL,NULL,NULL,'green',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(232,'Spinach','Winter Bloomsdale',NULL,NULL,NULL,NULL,'green','fall',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(233,'Spinach','Malaba',NULL,NULL,NULL,NULL,'green',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(234,'Spinach','New Zealand',NULL,NULL,NULL,NULL,'green',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(235,'Stevia',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(236,'Sugarcane','CP72-2086','FL sugar cane',NULL,NULL,NULL,NULL,NULL,'Perennial',NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(237,'Sugarcane','CP88-1762','FL sugar cane',NULL,NULL,NULL,NULL,NULL,'Perennial',NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(238,'Sugarcane','CP89-2143','FL sugar cane',NULL,28,NULL,NULL,NULL,'Perennial',NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(239,'Sugarcane','African Premium','Kenya sugar cane',NULL,NULL,NULL,NULL,NULL,'Perennial',NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(240,'Sunflower Seed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(241,'Sweet Corn',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(242,'Sweet Potatoes',NULL,NULL,NULL,33,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(243,'Swiss Chard',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(244,'Tea',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(245,'Thyme',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(246,'Tobacco',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(247,'Tomato',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(248,'Turnip',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(249,'Walnuts',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(250,'Watermelon',NULL,'Desc. Watermelon','Oil Seed',20,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(251,'Wheat',NULL,NULL,'Fruits',8,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(252,'Yams','ym','ym desc','Cereals',26,NULL,NULL,NULL,'Annual',NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(253,'Apple','Test 1','test 2','Fruits',15,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','2018-07-17 15:37:33',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(254,'Apple','Apple V1 ','Apple V1','Fruits',501,101,'Red','Year','Year',NULL,1,2,4,'','2018-07-16 18:49:07',1,'Stage_1','Stage_2','Stage_3','Stage_4','Stage_5','Stage_6','Stage_7','Stage_8','Stage_9','Stage_10'),(255,'Apple','Apple V2','Apple V2','Fruits',65.5,100.9000015258789,'Red','Yearly','Quarterly',NULL,2,3,63.25,'','2018-07-16 13:58:00',1,'1','2','3','4','5','6','7','8','9','10'),(256,'Apple','Test','test','Fruits',1,1,'1','1','1','1',1,1,1,'','2018-07-16 19:12:46',1,'1','1','1','1','1','1','11','1','1','1'),(257,'Apple','test variety 123','t4t','Fruits',124,12,'Red','','','',1,2,3,NULL,NULL,1,'Stage_1','Stage_2','Stage_3','Stage_4','Stage_5','Stage_6','Stage_7','Stage_8','Stage_9','Stage_10 test');
/*!40000 ALTER TABLE `crop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cropaction`
--

DROP TABLE IF EXISTS `cropaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cropaction` (
  `ID_crop_action` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `location` varchar(500) NOT NULL,
  `crop` bigint(20) NOT NULL,
  `action_date` date NOT NULL,
  `action_taken` varchar(500) NOT NULL,
  `amt` int(11) NOT NULL,
  `info` varchar(500) NOT NULL,
  PRIMARY KEY (`ID_crop_action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cropaction`
--

LOCK TABLES `cropaction` WRITE;
/*!40000 ALTER TABLE `cropaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `cropaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cropprice`
--

DROP TABLE IF EXISTS `cropprice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cropprice` (
  `ID_crop_price` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `crop` varchar(255) NOT NULL,
  `effective_date` date NOT NULL,
  `measure` varchar(500) NOT NULL,
  `amt` int(11) NOT NULL,
  PRIMARY KEY (`ID_crop_price`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cropprice`
--

LOCK TABLES `cropprice` WRITE;
/*!40000 ALTER TABLE `cropprice` DISABLE KEYS */;
/*!40000 ALTER TABLE `cropprice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cropyield`
--

DROP TABLE IF EXISTS `cropyield`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cropyield` (
  `ID_crop_yield` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `crop` bigint(20) NOT NULL,
  `location` varchar(500) NOT NULL,
  `target` varchar(255) NOT NULL,
  `year` date NOT NULL,
  `season` varchar(500) NOT NULL,
  `budget` int(11) NOT NULL,
  `contract` int(11) NOT NULL,
  `measure` varchar(500) NOT NULL,
  `company` bigint(20) NOT NULL,
  PRIMARY KEY (`ID_crop_yield`),
  KEY `CropYield_fk0` (`company`),
  CONSTRAINT `CropYield_fk0` FOREIGN KEY (`company`) REFERENCES `company` (`ID_company`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cropyield`
--

LOCK TABLES `cropyield` WRITE;
/*!40000 ALTER TABLE `cropyield` DISABLE KEYS */;
/*!40000 ALTER TABLE `cropyield` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dictionary`
--

DROP TABLE IF EXISTS `dictionary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dictionary` (
  `ID_dictionary` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `value` varchar(500) NOT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_dictionary`),
  KEY `idx_dictionary_isdeleted` (`isdeleted`)
) ENGINE=InnoDB AUTO_INCREMENT=317 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dictionary`
--

LOCK TABLES `dictionary` WRITE;
/*!40000 ALTER TABLE `dictionary` DISABLE KEYS */;
INSERT INTO `dictionary` VALUES (1,'ASD_Master_Data','Chemical','',NULL,NULL),(2,'ASD_Master_Data','Company','',NULL,NULL),(3,'ASD_Master_Data','Crop','',NULL,NULL),(4,'ASD_Master_Data','Disease','',NULL,NULL),(5,'ASD_Master_Data','Pest','',NULL,NULL),(6,'ASD_Master_Data','Sensor','',NULL,NULL),(7,'ASD_Master_Data','Subscription','',NULL,NULL),(8,'contactmethod','email','',NULL,NULL),(9,'contactmethod','Phone','',NULL,NULL),(10,'contactmethod','Text','',NULL,NULL),(11,'ContactType','Accounts Payable','',NULL,NULL),(12,'ContactType','Agronomist','',NULL,NULL),(13,'ContactType','Consultant','',NULL,NULL),(14,'ContactType','Executive','',NULL,NULL),(15,'ContactType','Farm Manager','',NULL,NULL),(16,'ContactType','Irrigation specialist','',NULL,NULL),(17,'ContactType','Processor Manager','',NULL,NULL),(18,'ContactType','Technical','',NULL,NULL),(19,'Country','Afghanistan','',NULL,NULL),(20,'Country','Albania','',NULL,NULL),(21,'Country','Algeria','',NULL,NULL),(22,'Country','Andorra','',NULL,NULL),(23,'Country','Angola','',NULL,NULL),(24,'Country','Anguilla','',NULL,NULL),(25,'Country','Antigua & Barbuda','',NULL,NULL),(26,'Country','Argentina','',NULL,NULL),(27,'Country','Armenia','',NULL,NULL),(28,'Country','Australia','',NULL,NULL),(29,'Country','Austria','',NULL,NULL),(30,'Country','Azerbaijan','',NULL,NULL),(31,'Country','Bahamas','',NULL,NULL),(32,'Country','Bahrain','',NULL,NULL),(33,'Country','Bangladesh','',NULL,NULL),(34,'Country','Barbados','',NULL,NULL),(35,'Country','Belarus','',NULL,NULL),(36,'Country','Belgium','',NULL,NULL),(37,'Country','Belize','',NULL,NULL),(38,'Country','Benin','',NULL,NULL),(39,'Country','Bermuda','',NULL,NULL),(40,'Country','Bhutan','',NULL,NULL),(41,'Country','Bolivia','',NULL,NULL),(42,'Country','Bosnia & Herzegovina','',NULL,NULL),(43,'Country','Botswana','',NULL,NULL),(44,'Country','Brazil','',NULL,NULL),(45,'Country','Brunei Darussalam','',NULL,NULL),(46,'Country','Bulgaria','',NULL,NULL),(47,'Country','Burkina Faso','',NULL,NULL),(48,'Country','Burundi','',NULL,NULL),(49,'Country','Cambodia','',NULL,NULL),(50,'Country','Cameroon','',NULL,NULL),(51,'Country','Canada','',NULL,NULL),(52,'Country','Cape Verde','',NULL,NULL),(53,'Country','Cayman Islands','',NULL,NULL),(54,'Country','Central African Republic','',NULL,NULL),(55,'Country','Chad','',NULL,NULL),(56,'Country','Chile','',NULL,NULL),(57,'Country','China','',NULL,NULL),(58,'Country','Colombia','',NULL,NULL),(59,'Country','Comoros','',NULL,NULL),(60,'Country','Congo','',NULL,NULL),(61,'Country','Costa Rica','',NULL,NULL),(62,'Country','Croatia','',NULL,NULL),(63,'Country','Cuba','',NULL,NULL),(64,'Country','Cyprus','',NULL,NULL),(65,'Country','Czech Republic','',NULL,NULL),(66,'Country','Democratic Republic of the Congo','',NULL,NULL),(67,'Country','Denmark','',NULL,NULL),(68,'Country','Djibouti','',NULL,NULL),(69,'Country','Dominica','',NULL,NULL),(70,'Country','Dominican Republic','',NULL,NULL),(71,'Country','Ecuador','',NULL,NULL),(72,'Country','Egypt','',NULL,NULL),(73,'Country','El Salvador','',NULL,NULL),(74,'Country','Equatorial Guinea','',NULL,NULL),(75,'Country','Eritrea','',NULL,NULL),(76,'Country','Estonia','',NULL,NULL),(77,'Country','Ethiopia','',NULL,NULL),(78,'Country','Fiji','',NULL,NULL),(79,'Country','Finland','',NULL,NULL),(80,'Country','France','',NULL,NULL),(81,'Country','French Guiana','',NULL,NULL),(82,'Country','Gabon','',NULL,NULL),(83,'Country','Gambia','',NULL,NULL),(84,'Country','Georgia','',NULL,NULL),(85,'Country','Germany','',NULL,NULL),(86,'Country','Ghana','',NULL,NULL),(87,'Country','Great Britain','',NULL,NULL),(88,'Country','Greece','',NULL,NULL),(89,'Country','Grenada','',NULL,NULL),(90,'Country','Guadeloupe','',NULL,NULL),(91,'Country','Guatemala','',NULL,NULL),(92,'Country','Guinea','',NULL,NULL),(93,'Country','Guinea-Bissau','',NULL,NULL),(94,'Country','Guyana','',NULL,NULL),(95,'Country','Haiti','',NULL,NULL),(96,'Country','Honduras','',NULL,NULL),(97,'Country','Hungary','',NULL,NULL),(98,'Country','Iceland','',NULL,NULL),(99,'Country','India','',NULL,NULL),(100,'Country','Indonesia','',NULL,NULL),(101,'Country','Iran','',NULL,NULL),(102,'Country','Iraq','',NULL,NULL),(103,'Country','Israel and the Occupied Territories','',NULL,NULL),(104,'Country','Italy','',NULL,NULL),(105,'Country','Ivory Coast (Cote d\'Ivoire)','',NULL,NULL),(106,'Country','Jamaica','',NULL,NULL),(107,'Country','Japan','',NULL,NULL),(108,'Country','Jordan','',NULL,NULL),(109,'Country','Kazakhstan','',NULL,NULL),(110,'Country','Kenya','',NULL,NULL),(111,'Country','Korea, Democratic Republic of (North Korea) ','',NULL,NULL),(112,'Country','Korea, Republic of (South Korea)','',NULL,NULL),(113,'Country','Kosovo','',NULL,NULL),(114,'Country','Kuwait','',NULL,NULL),(115,'Country','Kyrgyz Republic (Kyrgyzstan)','',NULL,NULL),(116,'Country','Laos','',NULL,NULL),(117,'Country','Latvia','',NULL,NULL),(118,'Country','Lebanon','',NULL,NULL),(119,'Country','Lesotho','',NULL,NULL),(120,'Country','Liberia','',NULL,NULL),(121,'Country','Libya','',NULL,NULL),(122,'Country','Liechtenstein','',NULL,NULL),(123,'Country','Lithuania','',NULL,NULL),(124,'Country','Luxembourg','',NULL,NULL),(125,'Country','Madagascar','',NULL,NULL),(126,'Country','Malawi','',NULL,NULL),(127,'Country','Malaysia','',NULL,NULL),(128,'Country','Maldives','',NULL,NULL),(129,'Country','Mali','',NULL,NULL),(130,'Country','Malta','',NULL,NULL),(131,'Country','Martinique','',NULL,NULL),(132,'Country','Mauritania','',NULL,NULL),(133,'Country','Mauritius','',NULL,NULL),(134,'Country','Mayotte','',NULL,NULL),(135,'Country','Mexico','',NULL,NULL),(136,'Country','Moldova, Republic of','',NULL,NULL),(137,'Country','Monaco','',NULL,NULL),(138,'Country','Mongolia','',NULL,NULL),(139,'Country','Montenegro','',NULL,NULL),(140,'Country','Montserrat','',NULL,NULL),(141,'Country','Morocco','',NULL,NULL),(142,'Country','Mozambique','',NULL,NULL),(143,'Country','Myanmar/Burma','',NULL,NULL),(144,'Country','Namibia','',NULL,NULL),(145,'Country','Nepal','',NULL,NULL),(146,'Country','Netherlands','',NULL,NULL),(147,'Country','New Zealand','',NULL,NULL),(148,'Country','Nicaragua','',NULL,NULL),(149,'Country','Niger','',NULL,NULL),(150,'Country','Nigeria','',NULL,NULL),(151,'Country','Norway','',NULL,NULL),(152,'Country','Oman','',NULL,NULL),(153,'Country','Pacific Islands','',NULL,NULL),(154,'Country','Pakistan','',NULL,NULL),(155,'Country','Panama','',NULL,NULL),(156,'Country','Papua New Guinea','',NULL,NULL),(157,'Country','Paraguay','',NULL,NULL),(158,'Country','Peru','',NULL,NULL),(159,'Country','Philippines','',NULL,NULL),(160,'Country','Poland','',NULL,NULL),(161,'Country','Portugal','',NULL,NULL),(162,'Country','Puerto Rico','',NULL,NULL),(163,'Country','Qatar','',NULL,NULL),(164,'Country','Republic of Macedonia','',NULL,NULL),(165,'Country','Reunion','',NULL,NULL),(166,'Country','Romania','',NULL,NULL),(167,'Country','Russian Federation','',NULL,NULL),(168,'Country','Rwanda','',NULL,NULL),(169,'Country','Saint Kitts and Nevis','',NULL,NULL),(170,'Country','Saint Lucia','',NULL,NULL),(171,'Country','Saint Vincent\'s & Grenadines','',NULL,NULL),(172,'Country','Samoa','',NULL,NULL),(173,'Country','Sao Tome and Principe','',NULL,NULL),(174,'Country','Saudi Arabia','',NULL,NULL),(175,'Country','Senegal','',NULL,NULL),(176,'Country','Serbia','',NULL,NULL),(177,'Country','Seychelles','',NULL,NULL),(178,'Country','Sierra Leone','',NULL,NULL),(179,'Country','Singapore','',NULL,NULL),(180,'Country','Slovak Republic (Slovakia)','',NULL,NULL),(181,'Country','Slovenia','',NULL,NULL),(182,'Country','Solomon Islands','',NULL,NULL),(183,'Country','Somalia','',NULL,NULL),(184,'Country','South Africa','',NULL,NULL),(185,'Country','South Sudan','',NULL,NULL),(186,'Country','Spain','',NULL,NULL),(187,'Country','Sri Lanka','',NULL,NULL),(188,'Country','Sudan','',NULL,NULL),(189,'Country','Suriname','',NULL,NULL),(190,'Country','Swaziland','',NULL,NULL),(191,'Country','Sweden','',NULL,NULL),(192,'Country','Switzerland','',NULL,NULL),(193,'Country','Syria','',NULL,NULL),(194,'Country','Tajikistan','',NULL,NULL),(195,'Country','Tanzania','',NULL,NULL),(196,'Country','Thailand','',NULL,NULL),(197,'Country','Timor Leste','',NULL,NULL),(198,'Country','Togo','',NULL,NULL),(199,'Country','Trinidad & Tobago','',NULL,NULL),(200,'Country','Tunisia','',NULL,NULL),(201,'Country','Turkey','',NULL,NULL),(202,'Country','Turkmenistan','',NULL,NULL),(203,'Country','Turks & Caicos Islands','',NULL,NULL),(204,'Country','Uganda','',NULL,NULL),(205,'Country','Ukraine','',NULL,NULL),(206,'Country','United Arab Emirates','',NULL,NULL),(207,'Country','United States of America (USA)','',NULL,NULL),(208,'Country','Uruguay','',NULL,NULL),(209,'Country','Uzbekistan','',NULL,NULL),(210,'Country','Venezuela','',NULL,NULL),(211,'Country','Vietnam','',NULL,NULL),(212,'Country','Virgin Islands (UK)','',NULL,NULL),(213,'Country','Virgin Islands (US)','',NULL,NULL),(214,'Country','Yemen','',NULL,NULL),(215,'Country','Zambia','',NULL,NULL),(216,'Country','Zimbabwe','',NULL,NULL),(217,'Crop_type','Cereals','',NULL,NULL),(218,'Crop_type','Pulses','',NULL,NULL),(219,'Crop_type','Roots & Tubers','',NULL,NULL),(220,'Crop_type','Oil Seed','',NULL,NULL),(221,'Crop_type','Vegetable','',NULL,NULL),(222,'Crop_type','Fruits','',NULL,NULL),(223,'Crop_type','Nuts','',NULL,NULL),(224,'Crop_type','Spice','',NULL,NULL),(225,'Currency','Baht','',NULL,NULL),(226,'Currency','BRL','',NULL,NULL),(227,'Currency','EUR','',NULL,NULL),(228,'Currency','USD','',NULL,NULL),(229,'Irrigation_Type','Center Pivot','',NULL,NULL),(230,'Irrigation_Type','Drip','',NULL,NULL),(231,'Irrigation_Type','Flood','',NULL,NULL),(232,'Language','Egypt','',NULL,NULL),(233,'Language','English','',NULL,NULL),(234,'Language','Portugese','',NULL,NULL),(235,'Language','Spanish','',NULL,NULL),(236,'Language','Thailand','',NULL,NULL),(237,'Location_Type','Alert Location','',NULL,NULL),(238,'Location_Type','Block','',NULL,NULL),(239,'Location_Type','Block (Quarter)','',NULL,NULL),(240,'Location_Type','Farm','',NULL,NULL),(241,'Location_Type','Field','',NULL,NULL),(242,'Location_Type','Management Zone','',NULL,NULL),(243,'Location_Type','Plot','',NULL,NULL),(244,'Location_Type','Ranch','',NULL,NULL),(245,'Manufacturer','Agrisource Data','',NULL,NULL),(246,'Master_Data','Contact Profile','',NULL,NULL),(247,'Master_Data','Irrigation','',NULL,NULL),(248,'Master_Data','Location','',NULL,NULL),(249,'Master_Data','Water Source','',NULL,NULL),(250,'MicroApp','Administration','',NULL,NULL),(251,'MicroApp','AgClarity Platform','',NULL,NULL),(252,'MicroApp','ASD Administration','',NULL,NULL),(253,'MicroApp','ATR','',NULL,NULL),(254,'MicroApp','Calendar','',NULL,NULL),(255,'MicroApp','Crop Health','',NULL,NULL),(256,'MicroApp','Data Integration','',NULL,NULL),(257,'MicroApp','Reporting & Analytics','',NULL,NULL),(258,'MicroApp','Scouting','',NULL,NULL),(259,'MicroApp','Water Management','',NULL,NULL),(260,'MicroApp','Weather','',NULL,NULL),(261,'MicroApp','Y3','',NULL,NULL),(262,'role','Administrator','end-user admin (CRUD)',NULL,NULL),(263,'role','Adviser','end-user advisor (R)',NULL,NULL),(264,'role','Agrisource Data Admin','ASD Admin',NULL,NULL),(265,'role','Agrisource Data Expert','ASD Expert',NULL,NULL),(266,'role','Contact','no access to the system',NULL,NULL),(267,'role','Expert - External','end-user expert (RU)',NULL,NULL),(268,'role','Expert - Internal','end-user expert (RU)',NULL,NULL),(269,'role','Management','end-user mgmt (RU)',NULL,NULL),(270,'Sensor_Type','Camera (drone)','',NULL,NULL),(271,'Sensor_Type','Camera (in-field)','',NULL,NULL),(272,'Sensor_Type','Pest','',NULL,NULL),(273,'Sensor_Type','Pollination','',NULL,NULL),(274,'Sensor_Type','Soil Moisture','',NULL,NULL),(275,'Sensor_Type','Temperature (ambient)','',NULL,NULL),(276,'Sensor_Type','Temperature (leaf)','',NULL,NULL),(277,'Sensor_Type','Water Level (surface)','',NULL,NULL),(278,'Sensor_Type','Water Level (well)','',NULL,NULL),(279,'Sensor_Type','Weather Station','',NULL,NULL),(280,'UOM','I','Imperial',NULL,NULL),(281,'UOM','M','Metric',NULL,NULL),(282,'Watersource','Canal','',NULL,NULL),(283,'Watersource','Rain','',NULL,NULL),(284,'Watersource','Surface Water','',NULL,NULL),(285,'Watersource','Well','',NULL,NULL),(286,'Alert_type','Reported ','',NULL,NULL),(287,'Alert_type','Verified','',NULL,NULL),(288,'Alert_type','Work-in-Progress','',NULL,NULL),(289,'Alert_type','Waiting','',NULL,NULL),(290,'Alert_type','Resolved','',NULL,NULL),(291,'Alert_type','Closed','',NULL,NULL),(292,'Chemical_Type','Herbacide','',NULL,NULL),(293,'Chemical_Type','Insecticide','',NULL,NULL),(294,'Chemical_Type','Fungicide','',NULL,NULL),(295,'Chemical_Type','PGR','',NULL,NULL),(296,'Alert_Action','Notify','',NULL,NULL),(297,'Alert_Action','Action','',NULL,NULL),(298,'Recommendation_type','Suggested','',NULL,NULL),(299,'Recommendation_type','Automated','',NULL,NULL),(300,'Disease_type','lesions',NULL,NULL,NULL),(301,'Disease_type','Fungus',NULL,NULL,NULL),(302,'Pest_type','insect',NULL,NULL,NULL),(303,'Pest_type','weed',NULL,NULL,NULL),(304,'MicroApp','AgClarity Administration',NULL,NULL,NULL),(305,'MicroApp','User Authentation',NULL,NULL,NULL),(306,'ContactSource','1','Office',NULL,NULL),(307,'ContactSource','4','Mobile',NULL,NULL),(308,'ContactSource','3','Home',NULL,NULL),(309,'ContactSource','2','Other',NULL,NULL),(310,'Location_Type','Sensor',NULL,NULL,NULL),(311,'Watersource','Surface',NULL,NULL,NULL),(312,'4t4t','4t4t4t',NULL,'','2018-08-07 12:55:01'),(313,'Provider_Type','Supplier',NULL,NULL,NULL),(314,'Provider_Type','Receiver','',NULL,NULL),(315,'Master_Data','Address',NULL,NULL,NULL),(316,'Master_Data','Provider',NULL,NULL,NULL);
/*!40000 ALTER TABLE `dictionary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `disease`
--

DROP TABLE IF EXISTS `disease`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `disease` (
  `ID_disease` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `type` varchar(255) NOT NULL,
  `severity` varchar(2000) DEFAULT NULL,
  `spread` varchar(2000) DEFAULT NULL,
  `symptoms` varchar(2000) DEFAULT NULL,
  `prevention` varchar(2000) DEFAULT NULL,
  `remedy` varchar(2000) DEFAULT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  `company` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ID_disease`),
  KEY `idx_disease_isdeleted` (`isdeleted`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disease`
--

LOCK TABLES `disease` WRITE;
/*!40000 ALTER TABLE `disease` DISABLE KEYS */;
INSERT INTO `disease` VALUES (1,'Sugarcane Orange Rust',NULL,'lesions',NULL,'wind and rain','The typical symptom of orange rust is a pustule (uredinial lesion) on the underside of the leaf (Magarey 2000). The pustule is oval in shape, measures 2–10 mm × 1–3 mm, and is cinnamon to orange in color. Depending on cultivar resistance level, pustules may be rare (or non-existent) to extensive on all the leaves. Orange rust pustules are easier to distinguish from those of brown rust on the younger, upper leaves than on the older, lower leaves. The spores of orange rust are orange, whereas the spores of brown rust are brown, as their names imply','Use specific cultivars','Fungicides',NULL,NULL,1),(2,'Sugarcane Orange Rust Test','The Sugarcane Orange Rust is a...','Fungus','Hight','Air and Rain','The typical symptom of orange rust is a More....','4','2',NULL,NULL,1),(3,'Test Disease','Test desc','Fungus','1','1','t44t4587','1','1',NULL,NULL,1),(4,'Disease 1','disease desc.','Fungus','a','128','Test tty54y5','1','2','','2018-07-16 18:14:10',3),(5,'Disease 2','Test disease desc.','lesions','15','874','28','128','8748','','2018-07-16 17:09:09',3),(6,'Disease 3','test','lesions','4t','154','847','87','15','','2018-07-16 18:20:54',3),(7,'Disease 4','test','lesions','148','458','12','48','2','','2018-07-16 17:09:06',3),(8,'Disease 2','test','Fungus','t','12','158','12','2',NULL,NULL,3),(9,'Disease 3','4y5','lesions','2','14','y51','12',NULL,'','2018-07-16 18:20:15',3),(10,'Disease 4','4515','lesions','t4t4t','t4t','4t4t','4t','t',NULL,NULL,3),(11,'Disease 5','test4t','lesions','t4t4','12','4584','21t4t','2t54t','','2018-07-16 18:55:26',4);
/*!40000 ALTER TABLE `disease` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email`
--

DROP TABLE IF EXISTS `email`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `email` (
  `ID_email` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(500) NOT NULL,
  `contact` bigint(20) NOT NULL,
  `type` bigint(20) DEFAULT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_email`),
  KEY `Email_fk0` (`contact`),
  KEY `idx_email_isdeleted` (`isdeleted`),
  CONSTRAINT `Email_fk0` FOREIGN KEY (`contact`) REFERENCES `contactprofile` (`ID_profile`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email`
--

LOCK TABLES `email` WRITE;
/*!40000 ALTER TABLE `email` DISABLE KEYS */;
INSERT INTO `email` VALUES (1,'sarah.maxwell@NorthAmericanAg.com',1,NULL,NULL,NULL),(2,'Jtulsa@NorthAmericanAg.com',2,1,NULL,NULL),(3,'Mwai.Maathai@WorldAg.com',3,NULL,NULL,NULL),(4,'Njoki@WorldAg.com',4,NULL,NULL,NULL),(5,'nilesh.sonkusare@techavidus.com',20,1,NULL,NULL),(6,'demo1@gmail.com',20,3,'','2018-07-26 19:24:29'),(7,'nilesh1@gmail.com',20,2,NULL,NULL),(10,'rob.peter19@gmail.com',22,1,NULL,NULL),(11,'demo1@gmail.com',22,2,NULL,NULL),(14,'nilesh1@gmail.com',22,3,'','2018-07-26 18:43:18'),(15,'demo2@gmail.com',22,3,NULL,NULL),(16,'steve@agrisourcedata.com',11,1,NULL,NULL),(17,'stevestrout@yahoo.com',11,3,'','2018-07-27 19:58:07'),(18,'test@test.com',2,2,'','2018-07-30 16:00:54');
/*!40000 ALTER TABLE `email` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipment`
--

DROP TABLE IF EXISTS `equipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `equipment` (
  `ID_equipment` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `description` varchar(2000) NOT NULL,
  PRIMARY KEY (`ID_equipment`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipment`
--

LOCK TABLES `equipment` WRITE;
/*!40000 ALTER TABLE `equipment` DISABLE KEYS */;
/*!40000 ALTER TABLE `equipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `error`
--

DROP TABLE IF EXISTS `error`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `error` (
  `ID_error` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `sensorID` bigint(20) NOT NULL,
  `error_code` varchar(255) NOT NULL,
  `data` text NOT NULL,
  PRIMARY KEY (`ID_error`),
  KEY `Error_fk0` (`sensorID`),
  CONSTRAINT `Error_fk0` FOREIGN KEY (`sensorID`) REFERENCES `sensor` (`ID_sensor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `error`
--

LOCK TABLES `error` WRITE;
/*!40000 ALTER TABLE `error` DISABLE KEYS */;
/*!40000 ALTER TABLE `error` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forecast`
--

DROP TABLE IF EXISTS `forecast`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `forecast` (
  `ID_forecast` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `location` bigint(20) NOT NULL,
  `crop` bigint(20) NOT NULL,
  `variety` varchar(255) NOT NULL,
  `measure` varchar(255) NOT NULL,
  `modelID` bigint(20) NOT NULL,
  `forcast_run_ID` varchar(255) NOT NULL,
  `best_case` int(11) NOT NULL,
  `worst_case` int(11) NOT NULL,
  `most_likely` int(11) NOT NULL,
  `target_harvest_date` int(11) NOT NULL,
  PRIMARY KEY (`ID_forecast`),
  KEY `Forecast_fk0` (`location`),
  KEY `Forecast_fk2` (`modelID`),
  KEY `Forecast_fk1` (`crop`),
  CONSTRAINT `Forecast_fk0` FOREIGN KEY (`location`) REFERENCES `location` (`ID_location`),
  CONSTRAINT `Forecast_fk1` FOREIGN KEY (`crop`) REFERENCES `crop` (`ID_crop`),
  CONSTRAINT `Forecast_fk2` FOREIGN KEY (`modelID`) REFERENCES `forecastmodel` (`ID_forestcast_model`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forecast`
--

LOCK TABLES `forecast` WRITE;
/*!40000 ALTER TABLE `forecast` DISABLE KEYS */;
/*!40000 ALTER TABLE `forecast` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forecast_details`
--

DROP TABLE IF EXISTS `forecast_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `forecast_details` (
  `ID_forecast_details` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `forecast_run_ID` varchar(255) NOT NULL,
  `forecast_period` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `location` varchar(500) NOT NULL,
  `crop` varchar(255) NOT NULL,
  `cycle` varchar(255) NOT NULL,
  `measure` varchar(255) NOT NULL,
  `modelID` varchar(255) NOT NULL,
  `target_date` date NOT NULL,
  `amt_type` varchar(255) NOT NULL,
  `amt` int(11) NOT NULL,
  `confidence` int(11) NOT NULL,
  `harvest` char(3) NOT NULL,
  `Attribute 1` char(1) NOT NULL,
  `Attribute 2` char(1) NOT NULL,
  `Attribute 3` char(1) NOT NULL,
  `Attribute 4` char(1) NOT NULL,
  `Attribute 5` char(1) NOT NULL,
  `Attribute 6` char(1) NOT NULL,
  `Attribute 7` char(1) NOT NULL,
  `Attribute 8` char(1) NOT NULL,
  `Attribute 9` char(1) NOT NULL,
  `Attribute 10` char(1) NOT NULL,
  PRIMARY KEY (`ID_forecast_details`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forecast_details`
--

LOCK TABLES `forecast_details` WRITE;
/*!40000 ALTER TABLE `forecast_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `forecast_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forecastmodel`
--

DROP TABLE IF EXISTS `forecastmodel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `forecastmodel` (
  `ID_forestcast_model` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `description` varchar(2000) NOT NULL,
  `author` varchar(255) NOT NULL,
  `organization` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `restriction` varchar(255) NOT NULL,
  `variety` varchar(255) NOT NULL,
  `last_used_by` varchar(255) NOT NULL,
  `last_used_date` date NOT NULL,
  `string` varchar(255) NOT NULL,
  PRIMARY KEY (`ID_forestcast_model`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forecastmodel`
--

LOCK TABLES `forecastmodel` WRITE;
/*!40000 ALTER TABLE `forecastmodel` DISABLE KEYS */;
/*!40000 ALTER TABLE `forecastmodel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `image`
--

DROP TABLE IF EXISTS `image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `image` (
  `ID_image` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `location` bigint(20) NOT NULL,
  `type` varchar(255) NOT NULL,
  `provider` varchar(500) NOT NULL,
  `high_value` int(11) NOT NULL,
  `low_value` int(11) NOT NULL,
  `mean` int(11) NOT NULL,
  PRIMARY KEY (`ID_image`),
  KEY `Image_fk0` (`location`),
  CONSTRAINT `Image_fk0` FOREIGN KEY (`location`) REFERENCES `location` (`ID_location`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image`
--

LOCK TABLES `image` WRITE;
/*!40000 ALTER TABLE `image` DISABLE KEYS */;
/*!40000 ALTER TABLE `image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `irrigation`
--

DROP TABLE IF EXISTS `irrigation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `irrigation` (
  `ID_irrigation` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `type` varchar(255) NOT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `volume_rating` varchar(1000) DEFAULT NULL,
  `location` bigint(20) DEFAULT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  `company` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ID_irrigation`),
  KEY `idx_irrigation_isdeleted` (`isdeleted`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `irrigation`
--

LOCK TABLES `irrigation` WRITE;
/*!40000 ALTER TABLE `irrigation` DISABLE KEYS */;
INSERT INTO `irrigation` VALUES (1,'CA-Drip','Drip',NULL,'.75 inches/hour',4,NULL,NULL,5),(2,'CA-Drip 2','Drip',NULL,'.75 inches/hour',5,NULL,NULL,5),(3,'CA-Drip 3','Drip',NULL,'1.25 inches/hour',6,NULL,NULL,1),(4,'FL-Flood ','Flood','canal feed flood',NULL,NULL,NULL,NULL,1),(5,'Test Irrigation 3','Center Pivot','Test description 3 ','1234784',NULL,NULL,NULL,1),(6,'uy55','Flood','5u5u5u','5u5u5u',NULL,'','2018-08-02 14:36:21',1),(7,'6u6u6','Drip','6u6u','6u6u6u',NULL,'','2018-08-02 14:40:43',1);
/*!40000 ALTER TABLE `irrigation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `irrigationlocation`
--

DROP TABLE IF EXISTS `irrigationlocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `irrigationlocation` (
  `ID_irrigation_location` bigint(20) NOT NULL AUTO_INCREMENT,
  `irrigation` bigint(20) NOT NULL,
  `location` bigint(20) NOT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_irrigation_location`),
  KEY `idx_irrigationlocation_isdeleted` (`isdeleted`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `irrigationlocation`
--

LOCK TABLES `irrigationlocation` WRITE;
/*!40000 ALTER TABLE `irrigationlocation` DISABLE KEYS */;
INSERT INTO `irrigationlocation` VALUES (1,5,1,NULL,NULL),(2,5,2,NULL,NULL),(3,5,3,NULL,NULL),(4,5,4,'','2018-08-02 12:18:09'),(5,5,24,'','2018-08-02 12:18:09'),(6,5,25,'','2018-08-02 12:18:09'),(7,5,26,'','2018-08-02 14:45:10'),(8,5,8,'','2018-08-02 17:25:50'),(9,5,5,'','2018-08-02 17:25:50'),(10,5,6,'','2018-08-02 14:46:31'),(11,6,3,NULL,NULL),(12,7,4,'','2018-08-02 14:36:01'),(14,7,2,'','2018-08-02 14:40:43');
/*!40000 ALTER TABLE `irrigationlocation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `level`
--

DROP TABLE IF EXISTS `level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `level` (
  `ID_level` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `sensorID` bigint(20) NOT NULL,
  `type` varchar(255) NOT NULL,
  `reading` int(11) NOT NULL,
  PRIMARY KEY (`ID_level`),
  KEY `Level_fk1` (`sensorID`),
  CONSTRAINT `Level_fk1` FOREIGN KEY (`sensorID`) REFERENCES `sensor` (`ID_sensor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `level`
--

LOCK TABLES `level` WRITE;
/*!40000 ALTER TABLE `level` DISABLE KEYS */;
/*!40000 ALTER TABLE `level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `location` (
  `ID_location` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `description` varchar(2000) NOT NULL,
  `address` varchar(2000) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `latitude` varchar(255) DEFAULT NULL,
  `polygon_data` varchar(500) DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `slope` varchar(255) DEFAULT NULL,
  `aspect` varchar(255) DEFAULT NULL,
  `elevation` int(11) DEFAULT NULL,
  `soil_texture` int(11) DEFAULT NULL,
  `soil_depth` int(11) DEFAULT NULL,
  `water_depth` int(11) DEFAULT NULL,
  `field_capacity` int(11) DEFAULT NULL,
  `mdp` int(11) DEFAULT NULL,
  `company` bigint(20) DEFAULT NULL,
  `related_to` bigint(20) DEFAULT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_location`),
  KEY `Location_fk0` (`company`),
  KEY `idx_location_isdeleted` (`isdeleted`),
  CONSTRAINT `Location_fk0` FOREIGN KEY (`company`) REFERENCES `company` (`ID_company`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,'Alpha Farm','Farm','Alpha Farm in CA',NULL,'36.884783','-120.126679',NULL,1762,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL),(2,'Ranch 1','Ranch','Alpha Farm, Ranch 1',NULL,NULL,NULL,NULL,857,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,NULL,NULL),(3,'Ranch 2','Ranch','Alpha Farm, Ranch 2',NULL,NULL,NULL,NULL,905,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,NULL,NULL),(4,'Field A1','Field','Alpha Farm, Ranch 1, Field A1',NULL,NULL,NULL,NULL,255,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,3,NULL,NULL),(5,'Field A2','Field','Alpha Farm, Ranch 1, Field A2',NULL,NULL,NULL,NULL,309,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,3,NULL,NULL),(6,'Field A3','Field','Alpha Farm, Ranch 1, Field A3',NULL,NULL,NULL,NULL,294,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,3,NULL,NULL),(7,'Field B1','Field','Alpha Farm, Ranch 2, Field B1',NULL,NULL,NULL,NULL,219,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,4,NULL,NULL),(8,'Field B2','Field','Alpha Farm, Ranch 2, Field B2',NULL,NULL,NULL,NULL,228,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,4,NULL,NULL),(9,'Field C1','Field','Alpha Farm, Ranch 2, Field C1',NULL,NULL,NULL,NULL,233,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,4,NULL,NULL),(10,'Field C2','Field','Alpha Farm, Ranch 2, Field C2',NULL,NULL,NULL,NULL,224,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,4,NULL,NULL),(11,'MZ 1','Mgmt Zone','Alpha Farm, Ranch 1, Field A1, MZ 1',NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,5,NULL,NULL),(12,'MZ 2','Mgmt Zone','Alpha Farm, Ranch 1, Field A1, MZ 2',NULL,NULL,NULL,NULL,7,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,5,NULL,NULL),(13,'Randolph Farm','Farm','Randolph Farm in FL',NULL,NULL,NULL,NULL,63021,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL),(14,'Block 1','Block','Randolph Farm, Block 1',NULL,NULL,NULL,NULL,22499,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,14,NULL,NULL),(15,'Block 2','Block','Randolph Farm, Block 2',NULL,NULL,NULL,NULL,26091,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,14,NULL,NULL),(16,'Field 1-01','Field','Randolph Farm, Block 1, Field 01',NULL,NULL,NULL,NULL,7200,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,15,NULL,NULL),(17,'Field 1-02','Field','Randolph Farm, Block 1, Field 02',NULL,NULL,NULL,NULL,7649,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,15,NULL,NULL),(18,'Field 1-03','Field','Randolph Farm, Block 1, Field 03',NULL,NULL,NULL,NULL,7649,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,15,NULL,NULL),(19,'Field 2-01','Field','Randolph Farm, Block 2, Field 01',NULL,NULL,NULL,NULL,13385,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,16,NULL,NULL),(20,'Field 2-02','Field','Randolph Farm, Block 2, Field 02',NULL,NULL,NULL,NULL,12706,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,16,NULL,NULL),(21,'Field 3-01','Field','Randolph Farm, Block 3',NULL,NULL,NULL,NULL,14432,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,14,NULL,NULL),(22,'Field 3-02','Field','Randolph Farm, Block 3, Field 01',NULL,NULL,NULL,NULL,13133,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,23,NULL,NULL),(23,'Well #3','Well','Alpha Farm, Ranch 2',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,4,NULL,NULL),(24,'Big Pond','Surface','Big Pond',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL),(25,'Canal 71','Surface','Canal 71',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL),(26,'Canal 26','Surface','Canal 26',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL),(27,'Canal N3','Surface','Canal N3',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL),(28,'Canal S-92','Surface','Canal S-92',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL),(29,'Canal 31','Surface','Canal 31',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL),(30,'Kebirigo Farm','Farm','Kebirigo Farm',NULL,'-0.61662','34.942302',NULL,173,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL),(31,'Field 1','Field','Kebirigo Field 1',NULL,NULL,NULL,NULL,92,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,31,NULL,NULL),(32,'Field 2','Field','Kebirigo Field 2',NULL,NULL,NULL,NULL,81,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,31,NULL,NULL),(33,'IntelliRoot Alpha Farm, Ranch 1, Field A1','Sensor','Sensor ID: 20170001690',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,5,NULL,NULL),(34,'IntelliRoot Alpha Farm, Ranch 1, Field A2','Sensor','SensorID: 20170001691',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,6,NULL,NULL),(35,'IntelliRoot Alpha Farm, Ranch 1, Field A3','Sensor','SensorID: 20170001692',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,7,NULL,NULL),(36,'IntelliRoot Alpha Farm, Ranch 2, Field B1','Sensor','SensorID: 20170001693',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,8,NULL,NULL),(37,'IntelliRoot Alpha Farm, Ranch 2, Field B2','Sensor','SensorID: 20170001696',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,9,NULL,NULL),(38,'IntelliRoot Alpha Farm, Ranch 2, Field C1','Sensor','SensorID: 20170001699',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,10,NULL,NULL),(39,'IntelliRoot Alpha Farm, Ranch 2, Field C2','Sensor','SensorID: 20170001703',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,11,NULL,NULL),(40,'IntelliRoot Alpha Farm, Ranch 1, Field A1, MZ 1','Sensor','SensorID: 20170001704',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,11,NULL,NULL),(41,'IntelliRoot Alpha Farm, Ranch 1, Field A1, MZ 2','Sensor','SensorID: 20170001707',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,12,NULL,NULL),(42,'IntelliRoot Alpha Farm, Ranch 1, Field A1','Sensor','SensorID: 20170001708',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,5,NULL,NULL),(43,'IntelliRoot Alpha Farm, Ranch 1, Field A2','Sensor','SensorID: 20170001712',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,6,NULL,NULL),(44,'WxTrack Alpha Farm, Ranch 1','Sensor','SensorID: 20170001463',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,3,NULL,NULL),(45,'TempTrack Alpha Farm, Ranch 1','Sensor','SensorID: 20180000012',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,3,NULL,NULL),(46,'TempTrack Alpha Farm, Ranch 2','Sensor','SensorID: 20180000013',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,4,NULL,NULL),(47,'TempTrack Alpha Farm, Ranch 1, Field A1, MZ 1','Sensor','SensorID: 20180000014',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,11,NULL,NULL),(48,'FuelTrack Alpha Farm, Ranch 1, Field A1, MZ 1','Sensor','SensorID: 20170001281',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,11,NULL,NULL),(49,'IntelliFlood Alpha Farm, Ranch 1, Field A1, MZ 1','Sensor','SensorID: 20170000956',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,11,NULL,NULL),(50,'Unknown Moisture Sensor Alpha Farm, Ranch 1','Sensor','External SensorID: 2017-E-0001200',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,3,NULL,NULL),(51,'Unknown Moisture Sensor Alpha Farm, Ranch 2','Sensor','External SensorID: 2017-E-0001201',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,4,NULL,NULL),(52,'Unknown Moisture Sensor Alpha Farm, Ranch 1, Field A1','Sensor','External SensorID: 2017-E-0001202',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,5,NULL,NULL),(53,'Unknown Moisture Sensor Alpha Farm, Ranch 1, Field A2','Sensor','External SensorID: 2017-E-0001203',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,6,NULL,NULL),(54,'Unknown Moisture Sensor Alpha Farm, Ranch 1, Field A3','Sensor','External SensorID: 2017-E-0001204',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,7,NULL,NULL),(55,'IntelliFlood Randolph Farm, Block 1','Sensor','SensorID: 20170000957',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,14,NULL,NULL),(56,'IntelliFlood Randolph Farm, Block 2','Sensor','SensorID: 20170000958',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,15,NULL,NULL),(57,'IntelliFlood Randolph Farm, Block 1, Field 01','Sensor','SensorID: 20170000960',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,16,NULL,NULL),(58,'IntelliFlood Randolph Farm, Block 1, Field 02','Sensor','SensorID: 20170000962',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,17,NULL,NULL),(59,'IntelliFlood Randolph Farm, Block 1, Field 03','Sensor','SensorID: 20170000966',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,18,NULL,NULL),(60,'IntelliFlood Randolph Farm, Block 2, Field 01','Sensor','SensorID: 20170000981',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,19,NULL,NULL),(61,'IntelliFlood Randolph Farm, Block 2, Field 02','Sensor','SensorID: 20170000982',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,20,NULL,NULL),(62,'IntelliFlood Randolph Farm, Block 3','Sensor','SensorID: 20170000983',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,21,NULL,NULL),(63,'IntelliFlood Randolph Farm, Block 3, Field 01','Sensor','SensorID: 20170000984',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,22,NULL,NULL),(64,'IntelliFlood Randolph Farm, Block 2','Sensor','SensorID: 20170000985',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,15,NULL,NULL),(65,'IntelliFlood Big Pond','Sensor','SensorID: 20170000986',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,13,NULL,NULL),(66,'FuelTrack Randolph Farm, Block 1','Sensor','SensorID: 20170001286',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,14,NULL,NULL),(67,'FuelTrack Randolph Farm, Block 2','Sensor','SensorID: 20170001287',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,15,NULL,NULL),(68,'FuelTrack Randolph Farm, Block 1, Field 01','Sensor','SensorID: 20170001288',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,16,NULL,NULL),(69,'FuelTrack Randolph Farm, Block 1, Field 02','Sensor','SensorID: 20170001292',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,17,NULL,NULL),(70,'FuelTrack Randolph Farm, Block 1, Field 03','Sensor','SensorID: 20170001293',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,18,NULL,NULL),(71,'WxTrack Randolph Farm, Block 2, Field 01','Sensor','SensorID: 20170001470',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,19,NULL,NULL),(72,'WxTrack Randolph Farm, Block 2, Field 02','Sensor','SensorID: 20170001471',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,20,NULL,NULL),(73,'WxTrack Randolph Farm, Block 3','Sensor','SensorID: 20170001472',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,22,NULL,NULL),(74,'WxTrack Randolph Farm, Block 3, Field 01','Sensor','SensorID: 20170001474',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,23,NULL,NULL),(75,'TempTrack Randolph Farm, Block 2','Sensor','SensorID: 20180000021',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,15,NULL,NULL),(76,'TempTrack Randolph Farm, Block 1','Sensor','SensorID: 20180000022',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,14,NULL,NULL),(77,'WxTrack Kebirigo Field 1','Sensor','SensorID: 20180010012',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,31,NULL,NULL),(78,'WxTrack Kebirigo Field 2','Sensor','SensorID: 20170001474',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,32,NULL,NULL),(79,'TempTrack Kebirigo Field 1','Sensor','SensorID: 20180000025',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,31,NULL,NULL),(80,'TempTrack Kebirigo Field 2','Sensor','SensorID: 20180000026',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,32,NULL,NULL),(81,'IntelliRoot Kebirigo Field 1','Sensor','SensorID: 20180002003',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,31,NULL,NULL),(82,'IntelliRoot Kebirigo Field 1','Sensor','SensorID: 20180002004',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,31,NULL,NULL),(83,'IntelliRoot Kebirigo Field 1','Sensor','SensorID: 20180002005',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,31,NULL,NULL),(84,'IntelliRoot Kebirigo Field 2','Sensor','SensorID: 20180002007',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,32,NULL,NULL),(85,'IntelliRoot Kebirigo Field 2','Sensor','SensorID: 20180002008',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,32,NULL,NULL),(86,'IntelliRoot Kebirigo Field 2','Sensor','SensorID: 20180002009',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,32,NULL,NULL),(87,'IntelliRoot Kebirigo Field 2','Sensor','SensorID: 20180002011',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,32,NULL,NULL),(88,'Test Location','Field','Field : 123','Test 12346','-150.00','38.975','',13,'78','78',35,17,18,23,25,25,1,5,'','2018-07-31 15:10:05');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `measure`
--

DROP TABLE IF EXISTS `measure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `measure` (
  `ID_measure` bigint(20) NOT NULL AUTO_INCREMENT,
  `crop-variety` bigint(20) NOT NULL,
  `measurement` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `company` bigint(20) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_measure`),
  KEY `Measure_fk0` (`company`),
  CONSTRAINT `Measure_fk0` FOREIGN KEY (`company`) REFERENCES `company` (`ID_company`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `measure`
--

LOCK TABLES `measure` WRITE;
/*!40000 ALTER TABLE `measure` DISABLE KEYS */;
INSERT INTO `measure` VALUES (1,1,'9.62','Tons per Acre',1,NULL),(2,2,'27.21','Tons per Acre',2,NULL);
/*!40000 ALTER TABLE `measure` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pest`
--

DROP TABLE IF EXISTS `pest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pest` (
  `ID_pest` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `severity` varchar(2000) DEFAULT NULL,
  `spread` varchar(2000) DEFAULT NULL,
  `symptoms` varchar(2000) DEFAULT NULL,
  `prevention` varchar(2000) DEFAULT NULL,
  `remedy` varchar(2000) DEFAULT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  `company` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ID_pest`),
  KEY `idx_pest_isdeleted` (`isdeleted`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pest`
--

LOCK TABLES `pest` WRITE;
/*!40000 ALTER TABLE `pest` DISABLE KEYS */;
INSERT INTO `pest` VALUES (1,'Fruit Fly','A fruit fly descriptio','insect',NULL,NULL,NULL,NULL,NULL,NULL,NULL,3),(2,'Common milkweed','A weed that gets everywhere','weed','low','air',NULL,NULL,NULL,NULL,NULL,2),(3,'Ramu stunt','leafhopper','insect','high',NULL,NULL,NULL,NULL,NULL,NULL,1),(4,'Pest 1','test pest','weed','12','454858','1t4t','t','56u56u',NULL,NULL,1),(5,'Pest 2','Pest 2 Descripition','insect','712','rest','test','teste','t4t',NULL,NULL,4),(6,'Pest 3','Pest 3 Description','insect','test severity','spreat','symptoms','prevention','remedy test',NULL,NULL,5),(7,'Pest 4','Pest 4 Description','insect','test severity 1','spread 1','symptoms 1','prevention ','remedy ','','2018-07-17 15:08:59',5),(8,'Pest 4','Pest 4 Description','insect','test severity','spread','symptoms','prevention','remedy',NULL,NULL,1);
/*!40000 ALTER TABLE `pest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phone`
--

DROP TABLE IF EXISTS `phone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phone` (
  `ID_phone` bigint(20) NOT NULL AUTO_INCREMENT,
  `number` varchar(255) NOT NULL,
  `contact` bigint(20) NOT NULL,
  `type` bigint(20) DEFAULT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_phone`),
  KEY `Phone_fk0` (`contact`),
  KEY `idx_phone_isdeleted` (`isdeleted`),
  CONSTRAINT `Phone_fk0` FOREIGN KEY (`contact`) REFERENCES `contactprofile` (`ID_profile`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phone`
--

LOCK TABLES `phone` WRITE;
/*!40000 ALTER TABLE `phone` DISABLE KEYS */;
INSERT INTO `phone` VALUES (1,'16153332121',1,1,NULL,NULL),(2,'16159872233',2,4,NULL,NULL),(3,'6153332121',20,1,NULL,NULL),(4,'1111111111',20,3,NULL,NULL),(5,'2222222222',20,2,NULL,NULL),(8,'6153332121',22,1,NULL,NULL),(9,'1234567890',22,4,'','2018-07-26 17:07:48'),(11,'4444444444',22,4,'','2018-07-26 18:43:18'),(12,'5555555555',22,4,NULL,NULL),(13,'7062847665',11,4,NULL,NULL),(14,'2222222222',2,1,'','2018-07-30 16:01:20'),(15,'3333333333',2,1,'','2018-07-30 16:24:46');
/*!40000 ALTER TABLE `phone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provider`
--

DROP TABLE IF EXISTS `provider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `provider` (
  `ID_provider` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `metric_imperial` char(1) NOT NULL,
  `locationID` bigint(20) DEFAULT NULL,
  `addressID` bigint(20) DEFAULT NULL,
  `related_to` bigint(20) DEFAULT NULL,
  `type` varchar(500) DEFAULT NULL,
  `company` bigint(20) DEFAULT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_provider`),
  KEY `idx_provider_isdeleted` (`isdeleted`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provider`
--

LOCK TABLES `provider` WRITE;
/*!40000 ALTER TABLE `provider` DISABLE KEYS */;
INSERT INTO `provider` VALUES (1,'BF - processing facility','I',15,1,NULL,'Supplier',1,NULL,NULL),(2,'BF - storage A','I',12,1,1,'Supplier',1,NULL,NULL),(3,'DB - distribution center 843','I',14,2,NULL,'Supplier',1,NULL,NULL),(4,'Walmart - Distribution AZ1','I',8,4,NULL,'Receiver',1,NULL,NULL),(5,'Target - Distribution CA2','I',1,4,NULL,'Receiver',1,NULL,NULL),(6,'Test Provider','I',NULL,3,NULL,'Supplier',5,NULL,NULL),(7,'test ','I',19,9,2,'Receiver',1,NULL,NULL);
/*!40000 ALTER TABLE `provider` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendation`
--

DROP TABLE IF EXISTS `recommendation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recommendation` (
  `ID_recommendation` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `location` bigint(20) NOT NULL,
  `description` varchar(2000) NOT NULL,
  PRIMARY KEY (`ID_recommendation`),
  KEY `Recommendation_fk0` (`location`),
  CONSTRAINT `Recommendation_fk0` FOREIGN KEY (`location`) REFERENCES `location` (`ID_location`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendation`
--

LOCK TABLES `recommendation` WRITE;
/*!40000 ALTER TABLE `recommendation` DISABLE KEYS */;
/*!40000 ALTER TABLE `recommendation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scouting_event`
--

DROP TABLE IF EXISTS `scouting_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scouting_event` (
  `ID_scouting_event` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `location` bigint(20) NOT NULL,
  `date_scheduled` date NOT NULL,
  `assigned_scout` varchar(500) NOT NULL,
  `instructions` varchar(500) NOT NULL,
  PRIMARY KEY (`ID_scouting_event`),
  KEY `Scouting_event_fk0` (`location`),
  CONSTRAINT `Scouting_event_fk0` FOREIGN KEY (`location`) REFERENCES `location` (`ID_location`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scouting_event`
--

LOCK TABLES `scouting_event` WRITE;
/*!40000 ALTER TABLE `scouting_event` DISABLE KEYS */;
/*!40000 ALTER TABLE `scouting_event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scoutingresult`
--

DROP TABLE IF EXISTS `scoutingresult`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scoutingresult` (
  `ID_scouting_result` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `location` bigint(20) NOT NULL,
  `crop` bigint(20) NOT NULL,
  `stage` varchar(255) NOT NULL,
  `notes` varchar(2000) NOT NULL,
  `overall` int(11) NOT NULL,
  `weeds` int(11) NOT NULL,
  `roots` int(11) NOT NULL,
  `leaves` int(11) NOT NULL,
  `soil` int(11) NOT NULL,
  `moisture` int(11) NOT NULL,
  `disease` int(11) NOT NULL,
  `pests` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  `color` varchar(255) NOT NULL,
  `size` int(11) NOT NULL,
  `shape` varchar(255) NOT NULL,
  PRIMARY KEY (`ID_scouting_result`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scoutingresult`
--

LOCK TABLES `scoutingresult` WRITE;
/*!40000 ALTER TABLE `scoutingresult` DISABLE KEYS */;
/*!40000 ALTER TABLE `scoutingresult` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `season`
--

DROP TABLE IF EXISTS `season`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `season` (
  `ID_season` bigint(20) NOT NULL AUTO_INCREMENT,
  `location` varchar(255) NOT NULL,
  `year` date NOT NULL,
  `cropID` bigint(20) NOT NULL,
  `stage_1` varchar(255) NOT NULL,
  `stage_1_date` date NOT NULL,
  `stage_1_gdd` int(11) NOT NULL,
  `stage_2` varchar(255) NOT NULL,
  `stage_2_date` date NOT NULL,
  `stage_2_gdd` int(11) NOT NULL,
  `stage_3` varchar(255) NOT NULL,
  `stage_3_date` date NOT NULL,
  `stage_3_gdd` int(11) NOT NULL,
  `stage_4` varchar(255) NOT NULL,
  `stage_4_date` date NOT NULL,
  `stage_4_gdd` int(11) NOT NULL,
  `stage_5` varchar(255) NOT NULL,
  `stage_5_date` date NOT NULL,
  `stage_5_gdd` int(11) NOT NULL,
  `stage_6` varchar(255) NOT NULL,
  `stage_6_date` date NOT NULL,
  `stage_6_gdd` int(11) NOT NULL,
  `stage_7` varchar(255) NOT NULL,
  `stage_7_date` date NOT NULL,
  `stage_7_gdd` int(11) NOT NULL,
  `stage_8` varchar(255) NOT NULL,
  `stage_8_date` date NOT NULL,
  `stage_8_gdd` int(11) NOT NULL,
  `stage_9` varchar(255) NOT NULL,
  `stage_9_date` date NOT NULL,
  `stage_9_gdd` int(11) NOT NULL,
  `stage_10` varchar(255) NOT NULL,
  `stage_10_date` date NOT NULL,
  `stage_10_gdd` int(11) NOT NULL,
  PRIMARY KEY (`ID_season`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `season`
--

LOCK TABLES `season` WRITE;
/*!40000 ALTER TABLE `season` DISABLE KEYS */;
/*!40000 ALTER TABLE `season` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensor`
--

DROP TABLE IF EXISTS `sensor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sensor` (
  `ID_sensor` bigint(20) NOT NULL AUTO_INCREMENT,
  `sensorid` varchar(1000) NOT NULL,
  `name` varchar(500) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `manufacturer` varchar(500) DEFAULT NULL,
  `model` varchar(500) DEFAULT NULL,
  `version` varchar(255) DEFAULT NULL,
  `manuf_date` date DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `mac_address` varchar(2000) DEFAULT NULL,
  `chipset` varchar(255) DEFAULT NULL,
  `status` tinyint(5) DEFAULT NULL,
  `first_install_date` date DEFAULT NULL,
  `last_install_date` date DEFAULT NULL,
  `calibration_date` date DEFAULT NULL,
  `last_service_date` date DEFAULT NULL,
  `battery_install_date` date DEFAULT NULL,
  `sensor_set_point` date DEFAULT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  `company` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ID_sensor`),
  KEY `idx_sensor_isdeleted` (`isdeleted`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensor`
--

LOCK TABLES `sensor` WRITE;
/*!40000 ALTER TABLE `sensor` DISABLE KEYS */;
INSERT INTO `sensor` VALUES (1,'123','Temprature','Temperature (ambient)','Temperature (ambient)','1','1.0',NULL,'temprature sensor','1.0.0.0','test',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(2,'111','Test Sensor1','Camera (drone)','Camera (drone)','1','1.0',NULL,'camera sensor','1.0.0.0','test1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(3,'t4t',NULL,'Camera (in-field)',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2018-07-19',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,'123',NULL,'Pest',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2018-07-07','2018-07-14','2018-07-12','2018-07-20','2018-07-27','2018-07-27',NULL,NULL,NULL),(5,'123456','Sensor 1','Camera (drone)','Agrisource Data',NULL,NULL,NULL,NULL,NULL,NULL,1,'2018-07-11','2018-07-12','2018-07-18',NULL,NULL,NULL,NULL,NULL,1),(6,'123','Test Company 1','Camera (drone)',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,'71454','17','Camera (in-field)','Agrisource Data','12','2',NULL,'desc',NULL,'rr',1,'2018-07-13','2018-07-12','2018-07-13','2018-07-14','2018-07-12','2018-07-05',NULL,NULL,3),(8,'123','Test Company 1','Camera (in-field)',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,'123','Test Company 1','Camera (in-field)',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','2018-07-18 18:13:55',2),(10,'123','Test Company 1','Pest',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2018-06-22',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2),(11,'123','Nilesh','Camera (drone)',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2018-07-12',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2),(12,'123','Test Company 1','Soil Moisture','Agrisource Data',NULL,NULL,NULL,NULL,NULL,NULL,1,'2018-07-11','2018-07-06','2018-07-07','2018-07-07','2018-07-08','2018-07-22',NULL,NULL,1),(13,'123','Apple','Camera (in-field)','Agrisource Data',NULL,NULL,NULL,NULL,NULL,NULL,1,'2018-07-26','2018-07-07','2018-07-19','2018-07-04',NULL,NULL,NULL,NULL,1),(14,'123','Test Company 1','Camera (in-field)','Agrisource Data',NULL,NULL,NULL,NULL,NULL,'t4t4tt4t4t',1,'2018-07-18',NULL,'2018-07-05',NULL,NULL,NULL,NULL,NULL,1),(15,'123','Apple','Temperature (leaf)','',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(16,'18441','4t4t','Pollination','Agrisource Data','114','332',NULL,'4t4t',NULL,'3t34t',1,'2018-07-19',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(17,'sensor 4','t4t4','Soil Moisture','Agrisource Data','yh5uy5y',NULL,NULL,NULL,NULL,NULL,1,NULL,'2018-07-12',NULL,NULL,NULL,NULL,NULL,NULL,1),(18,'sensor 4','3r3r','Soil Moisture','Agrisource Data','3r3r','r3',NULL,'3r3r',NULL,'3r3r',1,'2018-07-13',NULL,'2018-07-12',NULL,NULL,NULL,'','2018-07-19 15:43:02',1),(19,'IR-18-003-A','Soil Moisture Sensor - 3','Soil Moisture','Agrisource Data','IntelliRoot','2018-3',NULL,'This is a soil moisture sensor',NULL,NULL,1,'2018-03-06','2018-03-06','2018-03-08','2018-03-06','2018-03-06',NULL,NULL,NULL,5);
/*!40000 ALTER TABLE `sensor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `setpoint`
--

DROP TABLE IF EXISTS `setpoint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setpoint` (
  `ID_setpoint` bigint(20) NOT NULL AUTO_INCREMENT,
  `type` varchar(500) NOT NULL,
  `high` float NOT NULL,
  `low` float NOT NULL,
  `high_min_duration` float NOT NULL,
  `high_max_duration` float NOT NULL,
  `low_min_duration` float NOT NULL,
  `low_max_duration` float NOT NULL,
  PRIMARY KEY (`ID_setpoint`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setpoint`
--

LOCK TABLES `setpoint` WRITE;
/*!40000 ALTER TABLE `setpoint` DISABLE KEYS */;
INSERT INTO `setpoint` VALUES (1,'temp-metric',35,2,100000000,96,100000000,40),(2,'temp-imperial',95,35,100000000,96,100000000,40);
/*!40000 ALTER TABLE `setpoint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `soilmoisture`
--

DROP TABLE IF EXISTS `soilmoisture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `soilmoisture` (
  `ID_soilmoisture` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `sensorID` bigint(20) NOT NULL,
  `moisture_levelA` int(11) NOT NULL,
  `moisture_levelB` int(11) NOT NULL,
  `moisture_levelC` int(11) NOT NULL,
  PRIMARY KEY (`ID_soilmoisture`),
  KEY `SoilMoisture_fk1` (`sensorID`),
  CONSTRAINT `SoilMoisture_fk1` FOREIGN KEY (`sensorID`) REFERENCES `sensor` (`ID_sensor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `soilmoisture`
--

LOCK TABLES `soilmoisture` WRITE;
/*!40000 ALTER TABLE `soilmoisture` DISABLE KEYS */;
/*!40000 ALTER TABLE `soilmoisture` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `soilsample`
--

DROP TABLE IF EXISTS `soilsample`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `soilsample` (
  `ID_soil_sample` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `location` bigint(20) NOT NULL,
  `salinity` int(11) NOT NULL,
  `nitrogen` int(11) NOT NULL,
  `chemical` varchar(500) NOT NULL,
  `moisture` int(11) NOT NULL,
  PRIMARY KEY (`ID_soil_sample`),
  KEY `SoilSample_fk0` (`location`),
  CONSTRAINT `SoilSample_fk0` FOREIGN KEY (`location`) REFERENCES `location` (`ID_location`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `soilsample`
--

LOCK TABLES `soilsample` WRITE;
/*!40000 ALTER TABLE `soilsample` DISABLE KEYS */;
/*!40000 ALTER TABLE `soilsample` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription`
--

DROP TABLE IF EXISTS `subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscription` (
  `ID_subscription` bigint(20) NOT NULL AUTO_INCREMENT,
  `micro_app_name` varchar(255) NOT NULL,
  `app_level` varchar(255) DEFAULT NULL,
  `app_version` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `expire_date` date NOT NULL,
  `company` bigint(20) DEFAULT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_subscription`),
  KEY `Subscription_fk0` (`company`),
  KEY `idx_subscription_isdeleted` (`isdeleted`),
  CONSTRAINT `Subscription_fk0` FOREIGN KEY (`company`) REFERENCES `company` (`ID_company`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription`
--

LOCK TABLES `subscription` WRITE;
/*!40000 ALTER TABLE `subscription` DISABLE KEYS */;
INSERT INTO `subscription` VALUES (1,'AgClarity Platform','Individual','2018.6.006','2017-12-02','2020-11-30',1,'','2018-07-23 13:20:56'),(2,'Crop Health','Individual','2018.6.005','2017-12-01','2020-11-30',1,NULL,NULL),(3,'Water Management','Individual','2018.6.005','2017-12-01','2020-11-30',1,NULL,NULL),(4,'Y3','Individual','2018.6.005','2017-12-01','2020-11-30',1,NULL,NULL),(5,'Weather','Individual','2018.6.006','2017-12-02','2020-11-30',1,'','2018-07-23 13:20:56'),(6,'Administration','Individual','2018.6.005','2017-12-01','2020-11-30',1,NULL,NULL),(7,'AgClarity Platform',NULL,'2018.6.001','2018-03-02','2023-03-31',2,NULL,NULL),(8,'Crop Health',NULL,'2018.6.002','2018-03-02','2023-03-31',2,NULL,NULL),(9,'Water Management',NULL,'2018.7.001','2018-03-02','2023-03-31',2,NULL,NULL),(10,'ATR',NULL,'2018.8.001','2018-03-02','2023-03-31',NULL,NULL,NULL),(11,'Reporting & Analytics',NULL,'2018.6.002','2018-03-02','2023-03-31',2,NULL,NULL),(12,'Calendar',NULL,'2018.6.002','2018-03-02','2023-03-31',2,NULL,NULL),(13,'Weather',NULL,'2018.6.002','2018-03-02','2023-03-31',2,NULL,NULL),(14,'Administration',NULL,'2018.6.003','2018-03-02','2023-03-31',2,NULL,NULL),(15,'AgClarity Platform','Enterprise','2018.6.003','2018-05-01','2021-04-30',3,NULL,NULL),(16,'Crop Health','Enterprise','2018.6.003','2018-05-01','2021-04-30',3,NULL,NULL),(17,'Water Management',NULL,'2018.7.001','2018-05-01','2021-04-30',3,'','2018-07-23 14:02:53'),(18,'Y3','Enterprise','2018.6.003','2018-05-01','2021-04-30',3,NULL,NULL),(19,'Scouting','Enterprise','2018.6.003','2018-05-01','2021-04-30',3,NULL,NULL),(20,'Reporting & Analytics','Enterprise','2018.6.003','2018-05-01','2021-04-30',3,NULL,NULL),(21,'Calendar','Enterprise','2018.6.003','2018-05-01','2021-04-30',3,NULL,NULL),(22,'ATR','Enterprise','2018.6.003','2018-05-01','2021-04-30',3,NULL,NULL),(23,'Weather','Enterprise','2018.6.003','2018-05-01','2021-04-30',3,'','2018-07-23 16:34:20'),(24,'Administration','Enterprise','2018.6.003','2018-05-01','2021-04-30',3,NULL,NULL),(25,'AgClarity Platform',NULL,'2018.6.001','2018-06-01','2023-05-31',4,NULL,NULL),(26,'Crop Health',NULL,'2018.6.002','2018-06-01','2023-05-31',4,NULL,NULL),(27,'Water Management',NULL,'2018.7.001','2018-06-01','2023-05-31',4,NULL,NULL),(28,'Y3',NULL,'2018.6.002','2018-06-01','2023-05-31',4,NULL,NULL),(29,'Scouting',NULL,'2018.8.001','2018-06-01','2023-05-31',4,NULL,NULL),(30,'Reporting & Analytics',NULL,'2018.6.002','2018-06-01','2023-05-31',4,NULL,NULL),(31,'Calendar',NULL,'2018.6.002','2018-06-01','2023-05-31',4,NULL,NULL),(32,'ATR',NULL,'2018.8.001','2018-06-01','2023-05-31',4,NULL,NULL),(33,'Weather',NULL,'2018.6.002','2018-06-01','2023-05-31',4,NULL,NULL),(34,'Administration',NULL,'2018.6.003','2018-06-01','2023-05-31',4,NULL,NULL),(35,'AgClarity Platform',NULL,'2018.6.003','2017-10-01','2099-09-30',5,NULL,NULL),(36,'AgClarity Administration',NULL,'2018.6.003','2017-10-01','2099-09-30',5,NULL,NULL),(37,'Data Integration',NULL,'2018.6.003','2017-10-01','2099-09-30',5,'','2018-07-23 14:04:23'),(38,'User Authentation',NULL,'2018.6.003','2017-10-01','2099-09-30',5,NULL,NULL),(39,'Crop Health',NULL,'2018.6.003','2017-10-01','2099-09-30',5,'','2018-07-26 18:32:38'),(40,'Water Management',NULL,'2018.6.003','2017-10-01','2099-09-30',5,'','2018-07-23 14:13:03'),(41,'Y3',NULL,'2018.6.003','2017-10-01','2099-09-30',5,NULL,NULL),(42,'Scouting',NULL,'2018.6.003','2017-10-01','2099-09-30',5,'','2018-07-23 14:05:24'),(43,'Reporting & Analytics',NULL,'2018.6.003','2017-10-01','2099-09-30',5,NULL,NULL),(44,'Calendar',NULL,'2018.6.003','2017-10-01','2099-09-30',5,'','2018-07-23 14:04:40'),(45,'ATR',NULL,'2018.8.001','2017-10-01','2099-09-30',5,'','2018-07-23 14:03:49'),(46,'Weather',NULL,'2018.6.003','2017-10-01','2099-09-30',5,'','2018-07-26 12:20:24'),(47,'Administration',NULL,'2018.6.003','2017-10-01','2099-09-30',5,NULL,NULL),(48,'Scouting','Individual','2018.6.003','2017-12-01','2020-11-30',1,'','2018-07-23 12:17:13'),(49,'Scouting','Individual','2018.6.004','2017-12-01','2020-11-30',1,'','2018-07-23 12:23:58'),(50,'Reporting & Analytics','Individual','2018.6.004','2017-12-01','2020-11-30',1,'','2018-07-23 12:44:13'),(51,'Calendar','Individual','2018.6.005','2017-12-01','2020-11-30',1,'','2018-07-23 13:16:51'),(52,'Calendar','Individual','2018.6.004','2017-12-01','2020-11-30',1,'','2018-07-23 13:17:08'),(60,'Scouting','Individual','2018.6.005','2017-12-01','2020-11-30',1,'','2018-07-23 14:00:14'),(61,'Calendar','Individual','2018.6.005','2017-12-01','2020-11-30',1,'','2018-07-23 14:00:14'),(62,'Data Integration','Individual','2018.6.005','2017-12-01','2020-11-30',1,'','2018-07-23 13:59:55'),(64,'User Authentation','Individual','2018.6.005','2017-12-01','2020-11-30',1,'','2018-07-23 13:59:17'),(65,'ATR',NULL,'2018.6.003','2017-10-01','2099-09-30',5,'','2018-07-26 18:32:38');
/*!40000 ALTER TABLE `subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task` (
  `ID_task` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `location` bigint(20) NOT NULL,
  `assigned_to` varchar(500) NOT NULL,
  `due_date` date NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`ID_task`),
  KEY `Task_fk0` (`location`),
  CONSTRAINT `Task_fk0` FOREIGN KEY (`location`) REFERENCES `location` (`ID_location`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `useraction`
--

DROP TABLE IF EXISTS `useraction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `useraction` (
  `ID_user_action` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `description` varchar(2000) NOT NULL,
  `micro_app` varchar(500) NOT NULL,
  `user` bigint(20) NOT NULL,
  `value_1` varchar(500) DEFAULT NULL,
  `value_2` varchar(500) DEFAULT NULL,
  `value_3` varchar(500) DEFAULT NULL,
  `ref_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ID_user_action`)
) ENGINE=InnoDB AUTO_INCREMENT=462 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `useraction`
--

LOCK TABLES `useraction` WRITE;
/*!40000 ALTER TABLE `useraction` DISABLE KEYS */;
INSERT INTO `useraction` VALUES (2,'2018-07-17 15:32:14','update','ASD Admin',5,'company.dunsnumber','123','12385',10),(3,'2018-07-17 15:32:33','update','ASD Admin',5,'crop.type','Oil Seed','Fruits',257),(4,'2018-07-17 15:32:56','update','ASD Admin',5,'disease.description','4t4t','4515',10),(5,'2018-07-17 15:33:28','update','ASD Admin',5,'pest.spread','454','454858',4),(6,'2018-07-17 15:34:45','add','ASD Admin',5,'pest.ID_pest','8','8',8),(7,'2018-07-17 15:37:33','delete','ASD Admin',5,'crop.ID_crop','253','253',253),(8,'2018-07-17 15:56:27','update','ASD Admin',5,'crop.stage_10','Stage_10','Stage_10 test',257),(9,'2018-07-18 14:53:30','add','ASD Admin',5,'sensor.ID_sensor','1','1',1),(10,'2018-07-18 14:58:47','add','ASD Admin',5,'sensor.ID_sensor','2','2',2),(11,'2018-07-18 16:51:59','add','ASD Admin',5,'sensor.ID_sensor','3','3',3),(12,'2018-07-18 17:23:15','add','ASD Admin',5,'sensor.ID_sensor','4','4',4),(13,'2018-07-18 17:45:54','add','ASD Admin',5,'sensor.ID_sensor','5','5',5),(14,'2018-07-18 17:51:26','add','ASD Admin',5,'sensor.ID_sensor','6','6',6),(15,'2018-07-18 17:51:29','add','ASD Admin',5,'sensor.ID_sensor','7','7',7),(16,'2018-07-18 18:08:54','add','ASD Admin',5,'sensor.ID_sensor','8','8',8),(17,'2018-07-18 18:13:47','add','ASD Admin',5,'sensor.ID_sensor','9','9',9),(18,'2018-07-18 18:13:55','delete','ASD Admin',5,'sensor.ID_sensor','9','9',9),(19,'2018-07-18 18:14:05','add','ASD Admin',5,'sensor.ID_sensor','10','10',10),(20,'2018-07-18 19:10:44','add','ASD Admin',5,'sensor.ID_sensor','11','11',11),(21,'2018-07-19 10:46:28','add','ASD Admin',5,'sensor.ID_sensor','12','12',12),(22,'2018-07-19 11:16:34','add','ASD Admin',5,'sensor.ID_sensor','13','13',13),(23,'2018-07-19 12:07:00','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(24,'2018-07-19 12:07:17','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(25,'2018-07-19 12:13:38','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(26,'2018-07-19 12:13:54','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(27,'2018-07-19 12:14:04','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(28,'2018-07-19 12:50:16','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(29,'2018-07-19 12:50:29','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(30,'2018-07-19 12:50:35','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(31,'2018-07-19 12:51:08','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(32,'2018-07-19 12:51:20','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(33,'2018-07-19 12:51:54','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(34,'2018-07-19 12:58:43','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(35,'2018-07-19 12:59:11','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(36,'2018-07-19 12:59:25','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(37,'2018-07-19 12:59:44','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(38,'2018-07-19 13:00:12','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(39,'2018-07-19 13:00:19','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(40,'2018-07-19 13:00:31','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(41,'2018-07-19 13:01:30','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(42,'2018-07-19 13:02:26','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(43,'2018-07-19 13:09:34','add','ASD Admin',5,'sensor.ID_sensor','14','14',14),(44,'2018-07-19 13:22:27','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(45,'2018-07-19 13:27:02','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(46,'2018-07-19 13:27:12','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(47,'2018-07-19 13:27:24','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(48,'2018-07-19 13:30:46','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(49,'2018-07-19 15:21:05','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(50,'2018-07-19 15:21:16','add','ASD Admin',5,'sensor.ID_sensor','0','0',0),(51,'2018-07-19 15:27:29','add','ASD Admin',5,'sensor.ID_sensor','15','15',15),(52,'2018-07-19 15:30:23','update','ASD Admin',5,'sensor.type','Camera (drone)','Soil Moisture',15),(53,'2018-07-19 15:30:23','update','ASD Admin',5,'sensor.status','null','0',15),(54,'2018-07-19 15:31:00','update','ASD Admin',5,'sensor.type','Soil Moisture','Temperature (leaf)',15),(55,'2018-07-19 15:32:26','add','ASD Admin',5,'sensor.ID_sensor','16','16',16),(56,'2018-07-19 15:32:54','add','ASD Admin',5,'sensor.ID_sensor','17','17',17),(57,'2018-07-19 15:38:31','add','ASD Admin',5,'sensor.ID_sensor','18','18',18),(58,'2018-07-19 15:42:02','update','ASD Admin',5,'sensor.first_install_date','2018-07-12T18:30:00.000Z','2018/07/13',18),(59,'2018-07-19 15:42:02','update','ASD Admin',5,'sensor.calibration_date','null','2018/07/12',18),(60,'2018-07-19 15:43:02','delete','ASD Admin',5,'sensor.ID_sensor','18','18',18),(61,'2018-07-19 16:02:23','update','ASD Admin',5,'sensor.status','0','1',12),(62,'2018-07-19 16:02:23','update','ASD Admin',5,'sensor.first_install_date','2018-07-10T18:30:00.000Z','2018/07/11',12),(63,'2018-07-19 16:02:23','update','ASD Admin',5,'sensor.last_install_date','2018-07-05T18:30:00.000Z','2018/07/06',12),(64,'2018-07-19 16:02:23','update','ASD Admin',5,'sensor.calibration_date','2018-07-06T18:30:00.000Z','2018/07/07',12),(65,'2018-07-19 16:02:23','update','ASD Admin',5,'sensor.last_service_date','2018-07-06T18:30:00.000Z','2018/07/07',12),(66,'2018-07-19 16:02:23','update','ASD Admin',5,'sensor.battery_install_date','2018-07-07T18:30:00.000Z','2018/07/08',12),(67,'2018-07-19 16:02:23','update','ASD Admin',5,'sensor.sensor_set_point','2018-07-21T18:30:00.000Z','2018/07/22',12),(68,'2018-07-19 17:53:36','update','ASD Admin',5,'sensor.model','null','yh5uy5y',17),(69,'2018-07-19 17:54:11','update','ASD Admin',5,'sensor.type','Camera (in-field)','Soil Moisture',17),(70,'2018-07-19 17:54:17','update','ASD Admin',5,'sensor.last_install_date','null','2018/07/12',17),(161,'2018-07-23 13:50:30','add','ASD Admin',5,'subscription.ID_subscription','60','60',60),(162,'2018-07-23 13:50:30','update','ASD Admin',5,'subscription.app_version','2018.6.004','2018.6.005',6),(163,'2018-07-23 13:50:30','update','ASD Admin',5,'subscription.app_version','2018.6.004','2018.6.005',2),(164,'2018-07-23 13:50:30','update','ASD Admin',5,'subscription.app_version','2018.6.004','2018.6.005',3),(165,'2018-07-23 13:50:30','update','ASD Admin',5,'subscription.app_version','2018.6.004','2018.6.005',4),(166,'2018-07-23 13:51:50','add','ASD Admin',5,'subscription.ID_subscription','61','61',61),(167,'2018-07-23 13:55:16','add','ASD Admin',5,'subscription.ID_subscription','62','62',62),(169,'2018-07-23 13:57:27','add','ASD Admin',5,'subscription.ID_subscription','64','64',64),(170,'2018-07-23 13:59:17','delete','ASD Admin',5,'subscription.ID_subscription','64','64',64),(171,'2018-07-23 13:59:55','delete','ASD Admin',5,'subscription.ID_subscription','62','62',62),(172,'2018-07-23 14:00:14','delete','ASD Admin',5,'subscription.ID_subscription','61','61',61),(173,'2018-07-23 14:00:14','delete','ASD Admin',5,'subscription.ID_subscription','62','62',62),(174,'2018-07-23 14:00:15','delete','ASD Admin',5,'subscription.ID_subscription','60','60',60),(175,'2018-07-23 14:02:54','delete','ASD Admin',5,'subscription.ID_subscription','17','17',17),(176,'2018-07-23 14:02:54','update','ASD Admin',5,'subscription.app_level','null','Enterprise',24),(177,'2018-07-23 14:02:54','update','ASD Admin',5,'subscription.app_level','null','Enterprise',15),(178,'2018-07-23 14:02:54','update','ASD Admin',5,'subscription.app_version','2018.6.001','2018.6.003',15),(179,'2018-07-23 14:02:54','update','ASD Admin',5,'subscription.app_level','null','Enterprise',22),(180,'2018-07-23 14:02:54','update','ASD Admin',5,'subscription.app_version','2018.8.001','2018.6.003',22),(181,'2018-07-23 14:02:54','update','ASD Admin',5,'subscription.app_level','null','Enterprise',21),(182,'2018-07-23 14:02:54','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',21),(183,'2018-07-23 14:02:54','update','ASD Admin',5,'subscription.app_level','null','Enterprise',16),(184,'2018-07-23 14:02:54','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',16),(185,'2018-07-23 14:02:54','update','ASD Admin',5,'subscription.app_level','null','Enterprise',20),(186,'2018-07-23 14:02:54','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',20),(187,'2018-07-23 14:02:54','update','ASD Admin',5,'subscription.app_level','null','Enterprise',19),(188,'2018-07-23 14:02:54','update','ASD Admin',5,'subscription.app_version','2018.8.001','2018.6.003',19),(189,'2018-07-23 14:02:54','update','ASD Admin',5,'subscription.app_level','null','Enterprise',23),(190,'2018-07-23 14:02:54','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',23),(191,'2018-07-23 14:02:54','update','ASD Admin',5,'subscription.app_level','null','Enterprise',18),(192,'2018-07-23 14:02:54','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',18),(193,'2018-07-23 14:03:50','delete','ASD Admin',5,'subscription.ID_subscription','45','45',45),(194,'2018-07-23 14:03:50','update','ASD Admin',5,'subscription.app_version','2018.6.001','2018.6.003',36),(195,'2018-07-23 14:03:50','update','ASD Admin',5,'subscription.app_version','2018.6.001','2018.6.003',35),(196,'2018-07-23 14:03:50','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',44),(197,'2018-07-23 14:03:50','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',39),(198,'2018-07-23 14:03:50','update','ASD Admin',5,'subscription.app_version','2018.7.001','2018.6.003',37),(199,'2018-07-23 14:03:50','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',43),(200,'2018-07-23 14:03:50','update','ASD Admin',5,'subscription.app_version','2018.8.001','2018.6.003',42),(201,'2018-07-23 14:03:50','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',38),(202,'2018-07-23 14:03:50','update','ASD Admin',5,'subscription.app_version','2018.7.001','2018.6.003',40),(203,'2018-07-23 14:03:50','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',46),(204,'2018-07-23 14:03:50','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',41),(205,'2018-07-23 14:04:23','delete','ASD Admin',5,'subscription.ID_subscription','45','45',45),(206,'2018-07-23 14:04:23','delete','ASD Admin',5,'subscription.ID_subscription','37','37',37),(207,'2018-07-23 14:04:23','update','ASD Admin',5,'subscription.app_version','2018.6.001','2018.6.003',36),(208,'2018-07-23 14:04:24','update','ASD Admin',5,'subscription.app_version','2018.6.001','2018.6.003',35),(209,'2018-07-23 14:04:24','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',44),(210,'2018-07-23 14:04:24','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',39),(211,'2018-07-23 14:04:24','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',43),(212,'2018-07-23 14:04:24','update','ASD Admin',5,'subscription.app_version','2018.8.001','2018.6.003',42),(213,'2018-07-23 14:04:24','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',38),(214,'2018-07-23 14:04:24','update','ASD Admin',5,'subscription.app_version','2018.7.001','2018.6.003',40),(215,'2018-07-23 14:04:24','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',46),(216,'2018-07-23 14:04:24','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',41),(217,'2018-07-23 14:04:41','delete','ASD Admin',5,'subscription.ID_subscription','45','45',45),(218,'2018-07-23 14:04:41','delete','ASD Admin',5,'subscription.ID_subscription','44','44',44),(219,'2018-07-23 14:04:41','delete','ASD Admin',5,'subscription.ID_subscription','37','37',37),(220,'2018-07-23 14:04:41','update','ASD Admin',5,'subscription.app_version','2018.6.001','2018.6.003',36),(221,'2018-07-23 14:04:41','update','ASD Admin',5,'subscription.app_version','2018.6.001','2018.6.003',35),(222,'2018-07-23 14:04:41','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',39),(223,'2018-07-23 14:04:41','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',43),(224,'2018-07-23 14:04:41','update','ASD Admin',5,'subscription.app_version','2018.8.001','2018.6.003',42),(225,'2018-07-23 14:04:41','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',38),(226,'2018-07-23 14:04:41','update','ASD Admin',5,'subscription.app_version','2018.7.001','2018.6.003',40),(227,'2018-07-23 14:04:41','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',46),(228,'2018-07-23 14:04:41','update','ASD Admin',5,'subscription.app_version','2018.6.002','2018.6.003',41),(229,'2018-07-23 14:05:24','delete','ASD Admin',5,'subscription.ID_subscription','42','42',42),(230,'2018-07-23 14:06:17','add','ASD Admin',5,'subscription.ID_subscription','65','65',65),(231,'2018-07-23 14:13:03','delete','ASD Admin',5,'subscription.ID_subscription','40','40',40),(232,'2018-07-23 16:34:21','delete','ASD Admin',5,'subscription.ID_subscription','23','23',23),(233,'2018-07-25 15:11:57','add','Master Data',2,'contactprofile.ID_profile','19','19',19),(234,'2018-07-25 15:14:39','delete','Master Data',2,'contactprofile.ID_profile','19','19',19),(235,'2018-07-25 15:16:10','add','Master Data',2,'contactprofile.ID_profile','20','20',20),(236,'2018-07-25 15:17:11','add','Master Data',2,'phone.ID_phone','3','3',3),(237,'2018-07-25 15:17:12','add','Master Data',2,'phone.ID_phone','4','4',4),(238,'2018-07-25 15:17:12','add','Master Data',2,'phone.ID_phone','5','5',5),(239,'2018-07-25 15:17:12','add','Master Data',2,'email.ID_email','5','5',5),(240,'2018-07-25 15:17:12','add','Master Data',2,'email.ID_email','6','6',6),(241,'2018-07-25 15:17:12','add','Master Data',2,'email.ID_email','7','7',7),(242,'2018-07-26 12:20:24','delete','ASD Admin',5,'subscription.ID_subscription','46','46',46),(243,'2018-07-26 12:51:50','add','Master Data',2,'contactprofile.ID_profile','21','21',21),(244,'2018-07-26 12:51:50','add','Master Data',2,'phone.ID_phone','6','6',6),(245,'2018-07-26 12:51:50','add','Master Data',2,'phone.ID_phone','7','7',7),(246,'2018-07-26 12:51:50','add','Master Data',2,'email.ID_email','8','8',8),(247,'2018-07-26 12:51:50','add','Master Data',2,'email.ID_email','9','9',9),(248,'2018-07-26 12:51:58','delete','Master Data',2,'contactprofile.ID_profile','21','21',21),(249,'2018-07-26 14:19:06','add','Master Data',2,'contactprofile.ID_profile','22','22',22),(250,'2018-07-26 14:19:51','add','Master Data',2,'phone.ID_phone','8','8',8),(251,'2018-07-26 14:19:52','add','Master Data',2,'phone.ID_phone','9','9',9),(252,'2018-07-26 14:19:52','add','Master Data',2,'email.ID_email','10','10',10),(253,'2018-07-26 14:19:52','add','Master Data',2,'email.ID_email','11','11',11),(254,'2018-07-26 14:19:52','add','Master Data',2,'companyaccess.ID_company_access','21','21',21),(255,'2018-07-26 14:19:52','add','Master Data',2,'companyaccess.ID_company_access','22','22',22),(256,'2018-07-26 14:19:52','add','Master Data',2,'companyaccess.ID_company_access','23','23',23),(257,'2018-07-26 17:07:48','add','Master Data',2,'contactprofile.ID_profile','22','22',22),(258,'2018-07-26 17:07:48','add','Master Data',2,'phone.ID_phone','10','10',10),(259,'2018-07-26 17:07:48','add','Master Data',2,'phone.ID_phone','11','11',11),(260,'2018-07-26 17:07:48','delete','Master Data',2,'phone.ID_phone','9','9',9),(261,'2018-07-26 17:07:48','add','Master Data',2,'email.ID_email','12','12',12),(262,'2018-07-26 17:07:48','add','Master Data',2,'email.ID_email','13','13',13),(263,'2018-07-26 17:07:48','add','Master Data',2,'email.ID_email','14','14',14),(264,'2018-07-26 17:07:48','delete','Master Data',2,'companyaccess.ID_company_access','22','22',22),(265,'2018-07-26 18:32:39','delete','ASD Admin',5,'subscription.ID_subscription','65','65',65),(266,'2018-07-26 18:32:39','delete','ASD Admin',5,'subscription.ID_subscription','39','39',39),(267,'2018-07-26 18:43:18','add','Master Data',2,'contactprofile.ID_profile','22','22',22),(268,'2018-07-26 18:43:18','add','Master Data',2,'phone.ID_phone','12','12',12),(269,'2018-07-26 18:43:18','delete','Master Data',2,'phone.ID_phone','11','11',11),(270,'2018-07-26 18:43:18','add','Master Data',2,'email.ID_email','15','15',15),(271,'2018-07-26 18:43:18','delete','Master Data',2,'email.ID_email','14','14',14),(276,'2018-07-26 18:52:29','update','Master Data',2,'contactprofile.secondary_contact_method','Text','Phone',22),(277,'2018-07-26 19:00:31','add','Master Data',2,'companyaccess.ID_company_access','24','24',24),(278,'2018-07-26 19:08:24','update','Master Data',2,'contactprofile.address_1','test','test 123',22),(281,'2018-07-26 19:24:29','update','Master Data',2,'contactprofile.responsibility_level','Technical','Agronomist',20),(282,'2018-07-26 19:24:29','delete','Master Data',2,'email.ID_email','6','6',6),(283,'2018-07-26 19:25:07','add','Master Data',2,'companyaccess.ID_company_access','26','26',26),(284,'2018-07-27 17:45:28','add','Master Data',2,'contactaccess.id_contact_access','21','21',21),(285,'2018-07-27 17:45:28','add','Master Data',2,'contactaccess.id_contact_access','22','22',22),(286,'2018-07-27 17:45:28','add','Master Data',2,'contactaccess.id_contact_access','23','23',23),(287,'2018-07-27 17:45:28','add','Master Data',2,'contactaccess.id_contact_access','24','24',24),(288,'2018-07-27 17:45:28','add','Master Data',2,'contactaccess.id_contact_access','25','25',25),(289,'2018-07-27 17:45:28','add','Master Data',2,'contactaccess.id_contact_access','26','26',26),(290,'2018-07-27 17:45:28','add','Master Data',2,'contactaccess.id_contact_access','27','27',27),(291,'2018-07-27 17:45:28','add','Master Data',2,'contactaccess.id_contact_access','28','28',28),(292,'2018-07-27 17:45:29','add','Master Data',2,'contactaccess.id_contact_access','29','29',29),(293,'2018-07-27 17:45:29','add','Master Data',2,'contactaccess.id_contact_access','30','30',30),(294,'2018-07-27 17:45:29','add','Master Data',2,'contactaccess.id_contact_access','31','31',31),(295,'2018-07-27 17:45:29','add','Master Data',2,'contactaccess.id_contact_access','32','32',32),(296,'2018-07-27 17:45:29','add','Master Data',2,'contactaccess.id_contact_access','33','33',33),(297,'2018-07-27 17:55:24','add','Master Data',2,'contactaccess.id_contact_access','34','34',34),(298,'2018-07-27 17:55:24','add','Master Data',2,'contactaccess.id_contact_access','35','35',35),(299,'2018-07-27 17:55:24','add','Master Data',2,'contactaccess.id_contact_access','36','36',36),(300,'2018-07-27 17:55:24','add','Master Data',2,'contactaccess.id_contact_access','37','37',37),(301,'2018-07-27 17:55:24','add','Master Data',2,'contactaccess.id_contact_access','38','38',38),(302,'2018-07-27 17:55:24','add','Master Data',2,'contactaccess.id_contact_access','39','39',39),(303,'2018-07-27 18:09:56','add','Master Data',2,'contactaccess.id_contact_access','40','40',40),(304,'2018-07-27 18:09:56','add','Master Data',2,'contactaccess.id_contact_access','41','41',41),(305,'2018-07-27 18:09:56','delete','Master Data',2,'contactaccess.id_contact_access','25','25',25),(306,'2018-07-27 18:09:56','delete','Master Data',2,'contactaccess.id_contact_access','26','26',26),(307,'2018-07-27 18:09:56','delete','Master Data',2,'contactaccess.id_contact_access','27','27',27),(308,'2018-07-27 18:09:56','delete','Master Data',2,'contactaccess.id_contact_access','28','28',28),(309,'2018-07-27 19:37:46','delete','Master Data',2,'contactaccess.id_contact_access','38','38',38),(310,'2018-07-27 19:37:57','delete','Master Data',2,'contactaccess.id_contact_access','39','39',39),(311,'2018-07-27 19:51:11','update','Master Data',2,'contactprofile.responsibility_level','executive','Executive',11),(312,'2018-07-27 19:51:11','update','Master Data',2,'contactprofile.country','USA','United States of America (USA)',11),(313,'2018-07-27 19:51:11','update','Master Data',2,'contactprofile.access_role','AgrisourceData Admin','Agrisource Data Admin',11),(314,'2018-07-27 19:51:11','add','Master Data',2,'companyaccess.ID_company_access','27','27',27),(315,'2018-07-27 19:51:11','add','Master Data',2,'companyaccess.ID_company_access','28','28',28),(316,'2018-07-27 19:51:11','add','Master Data',2,'phone.ID_phone','13','13',13),(317,'2018-07-27 19:51:11','add','Master Data',2,'email.ID_email','16','16',16),(318,'2018-07-27 19:57:07','add','Master Data',2,'email.ID_email','17','17',17),(319,'2018-07-27 19:57:08','add','Master Data',2,'contactaccess.id_contact_access','42','42',42),(320,'2018-07-27 19:57:08','add','Master Data',2,'contactaccess.id_contact_access','43','43',43),(321,'2018-07-27 19:57:08','add','Master Data',2,'contactaccess.id_contact_access','44','44',44),(322,'2018-07-27 19:57:08','add','Master Data',2,'contactaccess.id_contact_access','45','45',45),(323,'2018-07-27 19:57:08','add','Master Data',2,'contactaccess.id_contact_access','46','46',46),(324,'2018-07-27 19:57:08','add','Master Data',2,'contactaccess.id_contact_access','47','47',47),(325,'2018-07-27 19:58:07','delete','Master Data',2,'email.ID_email','17','17',17),(326,'2018-07-27 19:58:08','add','Master Data',2,'contactaccess.id_contact_access','48','48',48),(327,'2018-07-27 19:58:08','add','Master Data',2,'contactaccess.id_contact_access','49','49',49),(328,'2018-07-27 19:58:08','add','Master Data',2,'contactaccess.id_contact_access','50','50',50),(329,'2018-07-27 19:58:08','add','Master Data',2,'contactaccess.id_contact_access','51','51',51),(330,'2018-07-27 19:58:08','add','Master Data',2,'contactaccess.id_contact_access','52','52',52),(331,'2018-07-27 19:58:08','add','Master Data',2,'contactaccess.id_contact_access','53','53',53),(332,'2018-07-27 19:58:08','add','Master Data',2,'contactaccess.id_contact_access','54','54',54),(333,'2018-07-27 19:58:08','add','Master Data',2,'contactaccess.id_contact_access','55','55',55),(334,'2018-07-27 19:58:08','add','Master Data',2,'contactaccess.id_contact_access','56','56',56),(335,'2018-07-27 19:58:08','add','Master Data',2,'contactaccess.id_contact_access','57','57',57),(336,'2018-07-27 19:58:08','add','Master Data',2,'contactaccess.id_contact_access','58','58',58),(337,'2018-07-27 19:58:08','add','Master Data',2,'contactaccess.id_contact_access','59','59',59),(338,'2018-07-27 19:58:08','add','Master Data',2,'contactaccess.id_contact_access','60','60',60),(339,'2018-07-27 19:58:08','add','Master Data',2,'contactaccess.id_contact_access','61','61',61),(340,'2018-07-27 20:02:21','add','ASD Admin',5,'sensor.ID_sensor','19','19',19),(341,'2018-07-30 15:50:26','update','Master Data',2,'contactprofile.country','US','United States of America (USA)',2),(342,'2018-07-30 15:50:27','update','Master Data',2,'email.type','null','1',2),(343,'2018-07-30 15:51:54','update','Master Data',2,'contactprofile.preferred_contact_method','text','Phone',2),(344,'2018-07-30 16:00:36','add','Master Data',2,'phone.ID_phone','14','14',14),(345,'2018-07-30 16:00:36','add','Master Data',2,'email.ID_email','18','18',18),(346,'2018-07-30 16:00:54','delete','Master Data',2,'email.ID_email','18','18',18),(347,'2018-07-30 16:01:20','delete','Master Data',2,'phone.ID_phone','14','14',14),(348,'2018-07-30 16:01:53','add','Master Data',2,'phone.ID_phone','15','15',15),(349,'2018-07-30 16:24:46','delete','Master Data',2,'phone.ID_phone','15','15',15),(350,'2018-07-31 13:33:19','add','Master Data',2,'location.ID_location','88','88',88),(353,'2018-07-31 15:08:35','update','Master Data',2,'location.address','Test 123','Test 12346',88),(354,'2018-07-31 15:08:35','update','Master Data',2,'location.elevation','25','35',88),(355,'2018-07-31 15:09:21','update','Master Data',2,'location.polygon_data','test','',88),(356,'2018-07-31 15:10:05','delete','Master Data',2,'location.ID_location','88','88',88),(357,'2018-08-01 17:46:41','add','Master Data',2,'irrigation.ID_irrigation','5','5',5),(358,'2018-08-01 17:46:41','add','Master Data',2,'irrigationlocation.ID_irrigation_location','1','1',1),(359,'2018-08-01 17:46:41','add','Master Data',2,'irrigationlocation.ID_irrigation_location','2','2',2),(360,'2018-08-01 17:46:41','add','Master Data',2,'irrigationlocation.ID_irrigation_location','3','3',3),(361,'2018-08-01 17:46:41','add','Master Data',2,'irrigationlocation.ID_irrigation_location','4','4',4),(362,'2018-08-02 12:14:42','add','Master Data',2,'irrigationlocation.ID_irrigation_location','5','5',5),(363,'2018-08-02 12:14:42','add','Master Data',2,'irrigationlocation.ID_irrigation_location','6','6',6),(364,'2018-08-02 12:14:42','add','Master Data',2,'irrigationlocation.ID_irrigation_location','7','7',7),(365,'2018-08-02 12:18:09','delete','Master Data',2,'irrigationlocation.ID_irrigation_location','4','4',4),(366,'2018-08-02 12:18:09','delete','Master Data',2,'irrigationlocation.ID_irrigation_location','5','5',5),(367,'2018-08-02 12:18:09','delete','Master Data',2,'irrigationlocation.ID_irrigation_location','6','6',6),(368,'2018-08-02 12:18:35','update','Master Data',2,'irrigation.volume_rating','123456789','123',5),(369,'2018-08-02 12:25:55','add','Master Data',2,'irrigationlocation.ID_irrigation_location','8','8',8),(370,'2018-08-02 12:26:15','update','Master Data',2,'irrigation.volume_rating','12345','1234578',5),(371,'2018-08-02 12:27:19','update','Master Data',2,'irrigation.volume_rating','1234578','1234',5),(372,'2018-08-02 12:30:09','add','Master Data',2,'companyaccess.ID_company_access','29','29',29),(373,'2018-08-02 12:32:10','update','Master Data',2,'contactprofile.responsibility_level','Consultant','Accounts Payable',22),(374,'2018-08-02 12:32:10','delete','Master Data',2,'companyaccess.ID_company_access','29','29',29),(375,'2018-08-02 12:36:53','update','Master Data',2,'irrigation.volume_rating','1234','123478',5),(376,'2018-08-02 12:36:53','add','Master Data',2,'irrigationlocation.ID_irrigation_location','9','9',9),(377,'2018-08-02 12:36:53','add','Master Data',2,'irrigationlocation.ID_irrigation_location','10','10',10),(378,'2018-08-02 12:51:17','update','Master Data',2,'irrigation.company','1','5',4),(379,'2018-08-02 13:57:32','add','Master Data',2,'irrigation.ID_irrigation','6','6',6),(380,'2018-08-02 13:57:32','add','Master Data',2,'irrigationlocation.ID_irrigation_location','11','11',11),(381,'2018-08-02 13:57:49','add','Master Data',2,'irrigation.ID_irrigation','7','7',7),(382,'2018-08-02 14:34:36','add','Master Data',2,'irrigationlocation.ID_irrigation_location','12','12',12),(383,'2018-08-02 14:34:49','add','Master Data',2,'irrigationlocation.ID_irrigation_location','13','13',13),(384,'2018-08-02 14:35:41','add','Master Data',2,'irrigationlocation.ID_irrigation_location','14','14',14),(385,'2018-08-02 14:36:01','delete','Master Data',2,'irrigationlocation.ID_irrigation_location','12','12',12),(386,'2018-08-02 14:36:16','delete','Master Data',2,'irrigationlocation.ID_irrigation_location','12','12',12),(387,'2018-08-02 14:36:21','delete','Master Data',2,'irrigation.ID_irrigation','6','6',6),(388,'2018-08-02 14:40:43','delete','Master Data',2,'irrigation.ID_irrigation','7','7',7),(389,'2018-08-02 14:45:11','delete','Master Data',2,'irrigationlocation.ID_irrigation_location','7','7',7),(390,'2018-08-02 14:45:39','update','Master Data',2,'irrigation.name','Test Irrigation 1','Test Irrigation',5),(391,'2018-08-02 14:45:39','update','Master Data',2,'irrigation.type','Center Pivot','Drip',5),(392,'2018-08-02 14:45:39','update','Master Data',2,'irrigation.description','Test description 1','Test description',5),(393,'2018-08-02 14:45:39','update','Master Data',2,'irrigation.volume_rating','123478 9','123478',5),(394,'2018-08-02 14:46:31','delete','Master Data',2,'irrigationlocation.ID_irrigation_location','10','10',10),(395,'2018-08-02 14:48:09','update','Master Data',2,'contactprofile.address_1','test 1232','test 123',22),(396,'2018-08-02 17:09:51','update','Master Data',2,'irrigation.description','Test description 3','Test description 3 i7779',5),(397,'2018-08-02 17:25:50','delete','Master Data',2,'irrigationlocation.ID_irrigation_location','8','8',8),(398,'2018-08-02 17:25:50','delete','Master Data',2,'irrigationlocation.ID_irrigation_location','9','9',9),(399,'2018-08-02 17:25:58','update','Master Data',2,'irrigation.description','Test description 3 i7779','Test description 3 ',5),(400,'2018-08-03 18:05:44','add','Master Data',2,'watersource.ID_watersource','10','10',10),(401,'2018-08-03 18:05:44','add','Master Data',2,'watersourcelocation.ID_watersource_location','1','1',1),(402,'2018-08-06 13:09:11','delete','Master Data',2,'watersource.ID_watersource','10','10',10),(403,'2018-08-06 13:15:23','update','Master Data',2,'watersource.description','4t4t','4t4t 77i7i',8),(404,'2018-08-06 13:18:18','add','Master Data',2,'watersourcelocation.ID_watersource_location','2','2',2),(405,'2018-08-06 13:18:18','add','Master Data',2,'watersourcelocation.ID_watersource_location','3','3',3),(406,'2018-08-06 13:18:18','add','Master Data',2,'watersourcelocation.ID_watersource_location','4','4',4),(407,'2018-08-06 13:18:18','add','Master Data',2,'watersourcelocation.ID_watersource_location','5','5',5),(408,'2018-08-06 13:18:18','add','Master Data',2,'watersourcelocation.ID_watersource_location','6','6',6),(409,'2018-08-06 13:18:18','add','Master Data',2,'watersourcelocation.ID_watersource_location','7','7',7),(410,'2018-08-06 13:19:09','delete','Master Data',2,'watersourcelocation.ID_watersource_location','7','7',7),(411,'2018-08-06 13:21:02','update','Master Data',2,'watersource.volume_rating','12','18',9),(412,'2018-08-06 13:21:02','update','Master Data',2,'watersource.min_depth','12.5','25.5',9),(413,'2018-08-06 13:21:02','update','Master Data',2,'watersource.max_depth','25.5','45.8',9),(414,'2018-08-06 13:21:44','add','Master Data',2,'watersourcelocation.ID_watersource_location','8','8',8),(415,'2018-08-06 13:21:44','add','Master Data',2,'watersourcelocation.ID_watersource_location','9','9',9),(416,'2018-08-06 13:21:44','add','Master Data',2,'watersourcelocation.ID_watersource_location','10','10',10),(417,'2018-08-06 13:21:44','add','Master Data',2,'watersourcelocation.ID_watersource_location','11','11',11),(418,'2018-08-06 13:21:44','add','Master Data',2,'watersourcelocation.ID_watersource_location','12','12',12),(419,'2018-08-06 13:21:45','add','Master Data',2,'watersourcelocation.ID_watersource_location','13','13',13),(420,'2018-08-06 13:21:45','add','Master Data',2,'watersourcelocation.ID_watersource_location','14','14',14),(421,'2018-08-06 15:13:54','update','Master Data',2,'watersource.description','pond','pond te',2),(422,'2018-08-06 15:14:12','update','Master Data',2,'watersource.description','pond te','pond',2),(423,'2018-08-06 15:44:54','add','Master Data',2,'watersource.ID_watersource','11','11',11),(424,'2018-08-06 15:44:54','add','Master Data',2,'watersourcelocation.ID_watersource_location','15','15',15),(425,'2018-08-06 15:44:54','add','Master Data',2,'watersourcelocation.ID_watersource_location','16','16',16),(426,'2018-08-06 15:44:54','add','Master Data',2,'watersourcelocation.ID_watersource_location','17','17',17),(427,'2018-08-06 15:44:54','add','Master Data',2,'watersourcelocation.ID_watersource_location','18','18',18),(428,'2018-08-06 15:44:54','add','Master Data',2,'watersourcelocation.ID_watersource_location','19','19',19),(429,'2018-08-06 15:44:54','add','Master Data',2,'watersourcelocation.ID_watersource_location','20','20',20),(430,'2018-08-06 15:45:41','update','Master Data',2,'watersource.description','t4t4t','t4t4t t4',11),(431,'2018-08-06 15:45:41','delete','Master Data',2,'watersourcelocation.ID_watersource_location','19','19',19),(432,'2018-08-06 15:46:42','delete','Master Data',2,'watersource.ID_watersource','11','11',11),(433,'2018-08-07 12:54:54','add','ASD Admin',5,'dictionary.ID_dictionary','312','312',312),(434,'2018-08-07 12:55:01','delete','ASD Admin',5,'dictionary.ID_dictionary','312','312',312),(435,'2018-08-07 13:08:56','add','ASD Admin',5,'dictionary.ID_dictionary','313','313',313),(436,'2018-08-07 13:09:05','add','ASD Admin',5,'dictionary.ID_dictionary','314','314',314),(437,'2018-08-07 15:36:43','update','ASD Admin',5,'dictionary.description','null','teds',314),(438,'2018-08-07 15:37:07','update','ASD Admin',5,'dictionary.description','teds','test',314),(439,'2018-08-07 16:13:41','update','ASD Admin',5,'dictionary.description','test','',314),(440,'2018-08-07 19:21:48','add','ASD Admin',5,'dictionary.ID_dictionary','315','315',315),(441,'2018-08-07 19:21:57','add','ASD Admin',5,'dictionary.ID_dictionary','316','316',316),(442,'2018-08-08 12:24:52','add','Master Data',2,'address.ID_address','5','5',5),(443,'2018-08-08 12:29:06','add','Master Data',2,'address.ID_address','6','6',6),(444,'2018-08-08 12:47:23','add','Master Data',2,'address.ID_address','7','7',7),(445,'2018-08-08 15:17:55','update','Master Data',2,'address.address_2','Infocity Circle','Infocity Circle ',7),(446,'2018-08-08 15:17:55','update','Master Data',2,'address.postal_code','382421','382420',7),(447,'2018-08-08 15:18:34','update','Master Data',2,'address.address_2','Infocity Circle ','Infocity Circle 1',7),(448,'2018-08-08 15:18:49','update','Master Data',2,'address.country','India','Iceland',7),(449,'2018-08-08 15:19:06','update','Master Data',2,'address.country','Iceland','India',7),(450,'2018-08-08 16:15:45','delete','Master Data',2,'address.ID_address','7','7',7),(451,'2018-08-09 17:14:31','add','Master Data',2,'provider.ID_provider','6','6',6),(452,'2018-08-09 18:12:58','add','Master Data',2,'address.ID_address','8','8',8),(453,'2018-08-09 18:13:42','add','Master Data',2,'provider.ID_provider','7','7',7),(454,'2018-08-10 11:21:28','update','Master Data',2,'provider.locationID','97','1',5),(455,'2018-08-10 11:21:49','update','Master Data',2,'provider.locationID','96','8',4),(456,'2018-08-10 11:21:53','update','Master Data',2,'provider.locationID','95','14',3),(457,'2018-08-10 11:21:58','update','Master Data',2,'provider.locationID','94','12',2),(458,'2018-08-10 11:22:02','update','Master Data',2,'provider.locationID','93','15',1),(459,'2018-08-10 11:24:31','update','Master Data',2,'provider.addressID','3','4',4),(460,'2018-08-10 11:36:36','add','Master Data',2,'address.ID_address','9','9',9),(461,'2018-08-10 11:36:41','update','Master Data',2,'provider.addressID','8','9',7);
/*!40000 ALTER TABLE `useraction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watersource`
--

DROP TABLE IF EXISTS `watersource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `watersource` (
  `ID_watersource` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `type` varchar(255) NOT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `volume_rating` varchar(1000) DEFAULT NULL,
  `location` int(11) DEFAULT NULL,
  `min_depth` double DEFAULT NULL,
  `max_depth` double DEFAULT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  `company` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`ID_watersource`),
  KEY `idx_watersource_isdeleted` (`isdeleted`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watersource`
--

LOCK TABLES `watersource` WRITE;
/*!40000 ALTER TABLE `watersource` DISABLE KEYS */;
INSERT INTO `watersource` VALUES (1,'Well # 3','Well','Well on north side','100 gpm',3,NULL,NULL,NULL,NULL,1),(2,'Big Pond','Surface','pond',NULL,4,4,27,NULL,NULL,1),(3,'Canal 71','Surface','Canal',NULL,5,3.5,9,NULL,NULL,1),(4,'Canal 26','Surface','Canal',NULL,5,3.2,9,NULL,NULL,5),(5,'Canal N3','Surface','Canal',NULL,4,3.5,9,NULL,NULL,5),(6,'Canal S-92','Surface','Canal',NULL,4,3.75,11,NULL,NULL,5),(7,'Canal 31','Surface','Canal',NULL,5,3,8,NULL,NULL,5),(8,'Test WaterSource','Rain','4t4t 77i7i','t44t4',NULL,12.5,15.5,NULL,NULL,1),(9,'Test WaterSource','Rain','t113','18',NULL,25.5,45.8,NULL,NULL,1),(10,'Test WaterSource','Canal','t','t4',NULL,12.5,25.5,'','2018-08-06 13:09:11',1),(11,'tr','Surface Water','t4t4t t4','t4t',NULL,12,15,'','2018-08-06 15:46:41',1);
/*!40000 ALTER TABLE `watersource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watersourcelocation`
--

DROP TABLE IF EXISTS `watersourcelocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `watersourcelocation` (
  `ID_watersource_location` bigint(20) NOT NULL AUTO_INCREMENT,
  `watersource` bigint(20) NOT NULL,
  `location` bigint(20) NOT NULL,
  `isdeleted` bit(1) DEFAULT NULL,
  `deletedon` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_watersource_location`),
  KEY `idx_watersourcelocation_isdeleted` (`isdeleted`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watersourcelocation`
--

LOCK TABLES `watersourcelocation` WRITE;
/*!40000 ALTER TABLE `watersourcelocation` DISABLE KEYS */;
INSERT INTO `watersourcelocation` VALUES (1,10,1,'','2018-08-06 13:09:11'),(2,8,1,NULL,NULL),(3,8,2,NULL,NULL),(4,8,3,NULL,NULL),(5,8,4,NULL,NULL),(6,8,5,NULL,NULL),(7,8,6,'','2018-08-06 13:19:09'),(8,9,23,NULL,NULL),(9,9,24,NULL,NULL),(10,9,25,NULL,NULL),(11,9,26,NULL,NULL),(12,9,27,NULL,NULL),(13,9,28,NULL,NULL),(14,9,29,NULL,NULL),(15,11,4,'','2018-08-06 15:46:42'),(16,11,5,'','2018-08-06 15:46:42'),(17,11,6,'','2018-08-06 15:46:42'),(18,11,7,'','2018-08-06 15:46:42'),(19,11,10,'','2018-08-06 15:45:41'),(20,11,11,'','2018-08-06 15:46:42');
/*!40000 ALTER TABLE `watersourcelocation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weather`
--

DROP TABLE IF EXISTS `weather`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `weather` (
  `ID_weather` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `location` bigint(20) NOT NULL,
  `provider` varchar(500) NOT NULL,
  `rainfall` int(11) NOT NULL,
  `temp` int(11) NOT NULL,
  `wind_speed` int(11) NOT NULL,
  `wind_direction` char(3) NOT NULL,
  `humidity` int(11) NOT NULL,
  `solar` int(11) NOT NULL,
  PRIMARY KEY (`ID_weather`),
  KEY `Weather_fk0` (`location`),
  CONSTRAINT `Weather_fk0` FOREIGN KEY (`location`) REFERENCES `location` (`ID_location`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weather`
--

LOCK TABLES `weather` WRITE;
/*!40000 ALTER TABLE `weather` DISABLE KEYS */;
/*!40000 ALTER TABLE `weather` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wx`
--

DROP TABLE IF EXISTS `wx`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wx` (
  `ID_Wx` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `sensorID` bigint(20) NOT NULL,
  `rainfall` int(11) NOT NULL,
  `temp` int(11) NOT NULL,
  `wind_speed` int(11) NOT NULL,
  `direction` char(3) NOT NULL,
  `humidity` int(11) NOT NULL,
  `solar` int(11) NOT NULL,
  PRIMARY KEY (`ID_Wx`),
  KEY `Wx_fk1` (`sensorID`),
  CONSTRAINT `Wx_fk1` FOREIGN KEY (`sensorID`) REFERENCES `sensor` (`ID_sensor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wx`
--

LOCK TABLES `wx` WRITE;
/*!40000 ALTER TABLE `wx` DISABLE KEYS */;
/*!40000 ALTER TABLE `wx` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-08-10 12:16:28
