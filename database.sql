CREATE DATABASE IF NOT EXISTS secure_api_db;
USE secure_api_db;

-- MySQL dump 10.13  Distrib 9.2.0, for macos14.7 (x86_64)
--
-- Host: localhost    Database: tech
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Classe`
--

DROP TABLE IF EXISTS `Classe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Classe` (
                          `id` int NOT NULL AUTO_INCREMENT,
                          `nom` varchar(50) NOT NULL,
                          `niveau` varchar(20) NOT NULL,
                          `annee_scolaire` varchar(9) NOT NULL,
                          `capacite` int DEFAULT NULL,
                          `responsable_id` int DEFAULT NULL,
                          PRIMARY KEY (`id`),
                          KEY `responsable_id` (`responsable_id`),
                          CONSTRAINT `classe_ibfk_1` FOREIGN KEY (`responsable_id`) REFERENCES `Professeur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Cours`
--

DROP TABLE IF EXISTS `Cours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Cours` (
                         `id` int NOT NULL AUTO_INCREMENT,
                         `matiere_id` int NOT NULL,
                         `professeur_id` int NOT NULL,
                         `classe_id` int NOT NULL,
                         `date_cours` date NOT NULL,
                         `heure_debut` time NOT NULL,
                         `heure_fin` time NOT NULL,
                         `salle` varchar(50) DEFAULT NULL,
                         `type_cours` enum('CM','TD','TP') NOT NULL,
                         `statut` enum('planifié','en cours','terminé') NOT NULL,
                         PRIMARY KEY (`id`),
                         KEY `matiere_id` (`matiere_id`),
                         KEY `professeur_id` (`professeur_id`),
                         KEY `classe_id` (`classe_id`),
                         CONSTRAINT `cours_ibfk_1` FOREIGN KEY (`matiere_id`) REFERENCES `Matiere` (`id`),
                         CONSTRAINT `cours_ibfk_2` FOREIGN KEY (`professeur_id`) REFERENCES `Professeur` (`id`),
                         CONSTRAINT `cours_ibfk_3` FOREIGN KEY (`classe_id`) REFERENCES `Classe` (`id`),
                         CONSTRAINT `cours_ibfk_4` FOREIGN KEY (`matiere_id`) REFERENCES `Matiere` (`id`),
                         CONSTRAINT `cours_ibfk_5` FOREIGN KEY (`professeur_id`) REFERENCES `Professeur` (`id`),
                         CONSTRAINT `cours_ibfk_6` FOREIGN KEY (`classe_id`) REFERENCES `Classe` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Eleve`
--

DROP TABLE IF EXISTS `Eleve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Eleve` (
                         `id` int NOT NULL AUTO_INCREMENT,
                         `nom` varchar(100) NOT NULL,
                         `prenom` varchar(100) NOT NULL,
                         `date_naissance` date DEFAULT NULL,
                         `email` varchar(255) DEFAULT NULL,
                         `telephone` varchar(20) DEFAULT NULL,
                         `adresse` text,
                         `classe_id` int DEFAULT NULL,
                         `photo` varchar(255) DEFAULT NULL,
                         `numero_etudiant` varchar(20) NOT NULL,
                         `date_inscription` date NOT NULL,
                         `statut` enum('actif','inactif') DEFAULT 'actif',
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `numero_etudiant` (`numero_etudiant`),
                         UNIQUE KEY `email` (`email`),
                         KEY `classe_id` (`classe_id`),
                         CONSTRAINT `eleve_ibfk_1` FOREIGN KEY (`classe_id`) REFERENCES `Classe` (`id`),
                         CONSTRAINT `eleve_ibfk_2` FOREIGN KEY (`classe_id`) REFERENCES `Classe` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Matiere`
--

DROP TABLE IF EXISTS `Matiere`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Matiere` (
                           `id` int NOT NULL AUTO_INCREMENT,
                           `nom` varchar(100) NOT NULL,
                           `code` varchar(20) NOT NULL,
                           `description` text,
                           `coefficient` decimal(4,2) DEFAULT '1.00',
                           `volume_horaire` int DEFAULT NULL,
                           PRIMARY KEY (`id`),
                           UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Professeur`
--

DROP TABLE IF EXISTS `Professeur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Professeur` (
                              `id` int NOT NULL AUTO_INCREMENT,
                              `nom` varchar(100) NOT NULL,
                              `prenom` varchar(100) NOT NULL,
                              `email` varchar(255) NOT NULL,
                              `telephone` varchar(20) DEFAULT NULL,
                              `password` varchar(255) NOT NULL,
                              `specialite` varchar(100) DEFAULT NULL,
                              `date_embauche` date DEFAULT NULL,
                              `statut` enum('actif','inactif') DEFAULT 'actif',
                              `role` enum('professeur','admin','responsable') DEFAULT 'professeur',
                              PRIMARY KEY (`id`),
                              UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Retard`
--

DROP TABLE IF EXISTS `Retard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Retard` (
                          `id` int NOT NULL AUTO_INCREMENT,
                          `eleve_id` int NOT NULL,
                          `class_id` int NOT NULL,
                          `date` int NOT NULL,
                          `heure_arrivee` time NOT NULL,
                          `duree_retard` int DEFAULT NULL COMMENT 'Durée en minutes',
                          `motif` text,
                          `justifie` tinyint(1) DEFAULT '0',
                          `document_justificatif` varchar(255) DEFAULT NULL,
                          `date_justification` date DEFAULT NULL,
                          `valide_par_id` int DEFAULT NULL,
                          `type` varchar(50) NOT NULL,
                          PRIMARY KEY (`id`),
                          KEY `eleve_id` (`eleve_id`),
                          KEY `class_id` (`class_id`),
                          KEY `valide_par_id` (`valide_par_id`),
                          CONSTRAINT `retard_ibfk_1` FOREIGN KEY (`eleve_id`) REFERENCES `Eleve` (`id`),
                          CONSTRAINT `retard_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `Classe` (`id`),
                          CONSTRAINT `retard_ibfk_3` FOREIGN KEY (`valide_par_id`) REFERENCES `Professeur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
                         `id` int NOT NULL AUTO_INCREMENT,
                         `username` varchar(100) DEFAULT NULL,
                         `email` varchar(100) NOT NULL,
                         `password` varchar(255) NOT NULL,
                         `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                         `image` varchar(255) DEFAULT NULL,
                         `bio` text,
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-28  1:03:54
