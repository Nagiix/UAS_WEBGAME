-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 01, 2025 at 12:54 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web_prog_uas`
--

-- --------------------------------------------------------

--
-- Table structure for table `enemies`
--

CREATE TABLE `enemies` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `difficulty` enum('easy','medium','hard','boss','special') NOT NULL,
  `level` int(11) NOT NULL,
  `hp` int(11) NOT NULL,
  `atk` int(11) NOT NULL,
  `def` int(11) NOT NULL,
  `expReward` int(11) NOT NULL,
  `goldReward` int(11) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enemies`
--

INSERT INTO `enemies` (`id`, `name`, `difficulty`, `level`, `hp`, `atk`, `def`, `expReward`, `goldReward`, `description`) VALUES
(1, 'Slime 1', 'easy', 1, 60, 10, 4, 7, 6, 'A easy tier enemy.'),
(2, 'Bat 2', 'easy', 2, 50, 9, 3, 6, 5, 'A easy tier enemy.'),
(3, 'Crawler 3', 'easy', 3, 70, 13, 6, 10, 8, 'A easy tier enemy.'),
(4, 'Bandit 4', 'easy', 2, 65, 12, 5, 9, 7, 'A easy tier enemy.'),
(5, 'Rat 5', 'easy', 1, 55, 8, 3, 5, 5, 'A easy tier enemy.'),
(6, 'Wolf 1', 'medium', 4, 100, 22, 12, 25, 30, 'A medium tier enemy.'),
(7, 'Thug 2', 'medium', 5, 110, 25, 13, 28, 25, 'A medium tier enemy.'),
(8, 'Shade 3', 'medium', 4, 90, 20, 10, 22, 22, 'A medium tier enemy.'),
(9, 'Sentry 4', 'medium', 6, 120, 30, 15, 30, 33, 'A medium tier enemy.'),
(10, 'Brute 5', 'medium', 5, 115, 27, 14, 27, 28, 'A medium tier enemy.'),
(11, 'Knight 1', 'hard', 7, 140, 45, 25, 80, 95, 'A hard tier enemy.'),
(12, 'Demon 2', 'hard', 9, 160, 48, 30, 85, 100, 'A hard tier enemy.'),
(13, 'Revenant 3', 'hard', 8, 130, 42, 22, 72, 87, 'A hard tier enemy.'),
(14, 'Warrior 4', 'hard', 9, 175, 50, 28, 90, 105, 'A hard tier enemy.'),
(15, 'Beast 5', 'hard', 7, 135, 40, 20, 70, 90, 'A hard tier enemy.'),
(16, 'King of Ashes', 'boss', 20, 260, 70, 35, 250, 250, 'A boss tier enemy.'),
(17, 'Eclipse Serpent', 'boss', 19, 250, 68, 33, 240, 240, 'A boss tier enemy.'),
(18, 'Timeless One', 'boss', 18, 240, 66, 30, 230, 230, 'A boss tier enemy.'),
(19, 'Blood Queen', 'boss', 17, 220, 60, 32, 210, 225, 'A boss tier enemy.'),
(20, 'Voidborn King', 'boss', 20, 255, 69, 34, 245, 248, 'A boss tier enemy.'),
(21, 'Eldritch Archmage', 'special', 7, 300, 40, 20, 300, 500, 'A powerful sorcerer who manipulates arcane energies beyond mortal comprehension.');

-- --------------------------------------------------------

--
-- Table structure for table `enemy_dialogues`
--

CREATE TABLE `enemy_dialogues` (
  `id` int(11) NOT NULL,
  `enemy_id` int(11) NOT NULL,
  `trigger` enum('intro','midphase','death') NOT NULL,
  `dialogue` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enemy_dialogues`
--

INSERT INTO `enemy_dialogues` (`id`, `enemy_id`, `trigger`, `dialogue`) VALUES
(1, 16, 'intro', 'You dare challenge the Ash King? Kneel.'),
(2, 16, 'midphase', 'You are persistent... but not invincible.'),
(3, 16, 'death', 'The ashes... will rise again...'),
(4, 17, 'intro', 'You’ve entered the deep unknowingly, fool.'),
(5, 17, 'midphase', 'My venom thickens. Let’s end this.'),
(6, 17, 'death', 'The abyss... welcomes me back...'),
(7, 18, 'intro', 'Time bends to no one — not even you.'),
(8, 18, 'midphase', 'The hourglass shatters... soon.'),
(9, 18, 'death', 'My cycle... ends... for now...'),
(10, 19, 'intro', 'Ah... fresh blood. Welcome.'),
(11, 19, 'midphase', 'Your heart races. I can hear it.'),
(12, 19, 'death', 'Sunlight... I despise it...'),
(13, 20, 'intro', 'You stand before Oblivion itself.'),
(14, 20, 'midphase', 'The void grows hungrier.'),
(15, 20, 'death', 'Darkness... consumes... me...'),
(16, 21, 'intro', 'You dare step into the realm of magic uninvited?'),
(17, 21, 'midphase', 'The weave trembles... your fate nears.'),
(18, 21, 'death', 'The arcane... shall remember me...');

-- --------------------------------------------------------

--
-- Table structure for table `enemy_moves`
--

CREATE TABLE `enemy_moves` (
  `id` int(11) NOT NULL,
  `enemy_id` int(11) NOT NULL,
  `move_name` varchar(50) NOT NULL,
  `min_dmg` int(11) NOT NULL,
  `max_dmg` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enemy_moves`
--

INSERT INTO `enemy_moves` (`id`, `enemy_id`, `move_name`, `min_dmg`, `max_dmg`) VALUES
(1, 1, 'SlimeSting', 6, 10),
(2, 1, 'SlimeBounce', 5, 9),
(3, 2, 'BatScreech', 5, 8),
(4, 2, 'WingFlap', 6, 10),
(5, 3, 'CrawlBite', 7, 11),
(6, 3, 'AcidSpit', 6, 10),
(7, 4, 'BanditSlash', 8, 12),
(8, 4, 'PocketSand', 7, 11),
(9, 5, 'RatNip', 4, 7),
(10, 5, 'Chew', 5, 9),
(11, 6, 'WolfBite', 15, 24),
(12, 6, 'Howl', 12, 20),
(13, 7, 'ThugPunch', 17, 26),
(14, 7, 'ClubSwing', 16, 25),
(15, 8, 'ShadeClaw', 14, 21),
(16, 8, 'DarkPulse', 15, 22),
(17, 9, 'SentryShot', 18, 27),
(18, 9, 'LaserBlast', 20, 30),
(19, 10, 'BruteSmash', 19, 29),
(20, 10, 'CrushingFist', 18, 28),
(21, 11, 'LanceThrust', 30, 48),
(22, 11, 'ShieldCrash', 28, 40),
(23, 12, 'DemonFlame', 32, 50),
(24, 12, 'HellSwipe', 30, 45),
(25, 13, 'RevenantStrike', 26, 40),
(26, 13, 'EtherealClaw', 25, 38),
(27, 14, 'WarriorCleave', 34, 52),
(28, 14, 'OverheadSmash', 36, 54),
(29, 15, 'BeastCharge', 28, 42),
(30, 15, 'SavageBite', 29, 45),
(31, 16, 'AshenStrike', 40, 60),
(32, 16, 'BlazingNova', 45, 65),
(33, 16, 'KingsDecree', 50, 70),
(34, 17, 'SerpentTailWhip', 42, 62),
(35, 17, 'ShadowVenom', 47, 67),
(36, 17, 'EclipseRoar', 51, 72),
(37, 18, 'TimelessSlash', 38, 58),
(38, 18, 'ChronoBurst', 43, 63),
(39, 18, 'EraCollapse', 49, 69),
(40, 19, 'BloodSpear', 36, 56),
(41, 19, 'VampiricDrain', 40, 60),
(42, 19, 'CrimsonWave', 46, 66),
(43, 20, 'VoidRoar', 44, 64),
(44, 20, 'NullBeam', 48, 68),
(45, 20, 'AbyssalJudgement', 52, 72),
(46, 21, 'Arcane Blast', 25, 35),
(47, 21, 'Mana Surge', 15, 30),
(48, 21, 'Astral Collapse', 30, 50);

-- --------------------------------------------------------

--
-- Table structure for table `scores`
--

CREATE TABLE `scores` (
  `ID` int(11) NOT NULL,
  `UID` int(11) NOT NULL,
  `Score` int(11) NOT NULL,
  `difficulty` enum('easy','normal','hard','impossible') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scores`
--

INSERT INTO `scores` (`ID`, `UID`, `Score`, `difficulty`) VALUES
(1, 1, 1772, 'easy'),
(2, 1, 1918, 'easy'),
(3, 1, 1818, 'easy'),
(4, 21, 970, 'easy'),
(5, 21, 911, 'easy'),
(6, 21, 1000, 'easy'),
(7, 21, 1750, 'easy'),
(8, 21, 1745, 'easy'),
(9, 21, 1150, 'easy'),
(10, 21, 1629, 'easy'),
(11, 21, 1348, 'easy'),
(12, 21, 1811, 'easy'),
(13, 25, 1150, 'easy'),
(14, 21, 759, 'easy'),
(15, 21, 2429, 'easy'),
(16, 21, 1859, 'easy'),
(17, 21, 1652, 'impossible');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nickname` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `nickname`) VALUES
(1, 'alice', 'TESTER1', 'AL'),
(2, 'bob', 'TESTER2', 'BOBBY'),
(21, 'ADMIN', '123123', 'ADMIN'),
(22, '', '$2y$10$BPyQj3bcFnFmD1KuHTMMEO3rSixFaM8.axXeLMYJAbhvzs1J.RUIy', NULL),
(23, 'Dimas', '123123', 'DIM'),
(24, 'TESTER3', '123123', 'TESTERRRRR'),
(25, 'YOGA', '123123', 'Yoga');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `enemies`
--
ALTER TABLE `enemies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enemy_dialogues`
--
ALTER TABLE `enemy_dialogues`
  ADD PRIMARY KEY (`id`),
  ADD KEY `enemy_id` (`enemy_id`);

--
-- Indexes for table `enemy_moves`
--
ALTER TABLE `enemy_moves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `enemy_id` (`enemy_id`);

--
-- Indexes for table `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `UID` (`UID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `enemies`
--
ALTER TABLE `enemies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `enemy_dialogues`
--
ALTER TABLE `enemy_dialogues`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `enemy_moves`
--
ALTER TABLE `enemy_moves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `scores`
--
ALTER TABLE `scores`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `enemy_dialogues`
--
ALTER TABLE `enemy_dialogues`
  ADD CONSTRAINT `enemy_dialogues_ibfk_1` FOREIGN KEY (`enemy_id`) REFERENCES `enemies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `enemy_moves`
--
ALTER TABLE `enemy_moves`
  ADD CONSTRAINT `enemy_moves_ibfk_1` FOREIGN KEY (`enemy_id`) REFERENCES `enemies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `scores`
--
ALTER TABLE `scores`
  ADD CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`UID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
