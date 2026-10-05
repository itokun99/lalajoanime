-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 02, 2019 at 11:40 AM
-- Server version: 10.1.37-MariaDB
-- PHP Version: 7.0.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `weebonime_master`
--

-- --------------------------------------------------------

--
-- Table structure for table `animes`
--

CREATE TABLE `animes` (
  `anime_id` int(11) NOT NULL,
  `anime_mal_id` int(11) NOT NULL,
  `anime_title` text NOT NULL,
  `datez` datetime NOT NULL,
  `publish` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `animes`
--

INSERT INTO `animes` (`anime_id`, `anime_mal_id`, `anime_title`, `datez`, `publish`) VALUES
(1, 32182, 'Mob Psycho 100', '2019-03-02 00:00:00', 1),
(2, 32949, 'Kuzu no Honkai', '2019-03-02 00:00:00', 1),
(3, 36474, 'Sword Art Online: Alicization', '2019-03-02 00:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `anime_details`
--

CREATE TABLE `anime_details` (
  `anime_detail_id` int(11) NOT NULL,
  `anime_id` int(11) NOT NULL,
  `anime_sinopsis` text NOT NULL,
  `anime_release_date` date NOT NULL,
  `anime_genres` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `animes`
--
ALTER TABLE `animes`
  ADD PRIMARY KEY (`anime_id`);

--
-- Indexes for table `anime_details`
--
ALTER TABLE `anime_details`
  ADD PRIMARY KEY (`anime_detail_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `animes`
--
ALTER TABLE `animes`
  MODIFY `anime_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `anime_details`
--
ALTER TABLE `anime_details`
  MODIFY `anime_detail_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
