DROP DATABASE sp_games;
CREATE DATABASE IF NOT EXISTS `sp_games` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sp_games`;

SET GLOBAL time_zone = '+8:00';

-- ====================================================================
-- main tables :D
-- ====================================================================
CREATE TABLE `users` (
	`userid` INT AUTO_INCREMENT NOT NULL,
    `username` VARCHAR(30) NOT NULL,
    `password` VARCHAR(50) NOT NULL,
    `email` VARCHAR(80) NOT NULL,
    `member_type` VARCHAR(20) CHECK (member_type IN ('Member', 'Bronze', 'Silver', 'Gold', 'Diamond', 'admin')),
    `points` INT NOT NULL,
    `profile_picture_url` VARCHAR(100) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (`userid`),
    UNIQUE (`email`)
);

CREATE TABLE `games` (
	`gameid` INT AUTO_INCREMENT NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` VARCHAR(1000) NOT NULL,
	`year` INT NOT NULL CHECK (`year` >= 1000 AND `year` <= 2023),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (`gameid`),
    UNIQUE (`title`)
);

CREATE TABLE `category` (
	`categoryid` INT AUTO_INCREMENT NOT NULL,
    `categoryname` VARCHAR(30) NOT NULL,
    `description` VARCHAR(200) NOT NULL,
    PRIMARY KEY (`categoryid`),
    UNIQUE (`categoryname`)
);

CREATE TABLE `platform` (
	`platformid` INT AUTO_INCREMENT NOT NULL,
    `platformname` VARCHAR(50) NOT NULL,
    `description` VARCHAR(200) NOT NULL,
    PRIMARY KEY (`platformid`),
    UNIQUE (`platformname`)
);

CREATE TABLE `review` (
	`reviewid` INT AUTO_INCREMENT NOT NULL,
    `userid` INT NOT NULL,
    `gameid` INT NOT NULL,
    `content` VARCHAR(500) NOT NULL,
    `rating` CHAR(1) NOT NULL CHECK (`rating` >= 0 AND `rating` <= 5),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (`reviewid`),
    FOREIGN KEY (userid) REFERENCES users(userid),
    FOREIGN KEY (gameid) REFERENCES games(gameid) ON DELETE CASCADE
);

CREATE TABLE `gamesImage` (
	`gameid` INT NOT NULL,
    `filepath` VARCHAR(1000) NOT NULL,
    FOREIGN KEY (gameid) REFERENCES games(gameid) ON DELETE CASCADE,
    UNIQUE (gameid)
);

CREATE TABLE `cart` (
	`itemid` INT AUTO_INCREMENT NOT NULL,
    `userid` INT NOT NULL,
	`gameid` INT NOT NULL,
    `platformid` INT NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP(),
    FOREIGN KEY (gameid) REFERENCES games(gameid) ON DELETE CASCADE,
    FOREIGN KEY (platformid) REFERENCES platform(platformid),
    FOREIGN KEY (userid) REFERENCES users(userid),
    UNIQUE (userid, gameid, platformid),
    PRIMARY KEY (itemid)
);


-- ====================================================================
-- intermediate tables :)
-- ====================================================================
CREATE TABLE `gamesByCategory` (
	`gameid` INT NOT NULL,
    `categoryid` INT NOT NULL,
    FOREIGN KEY (gameid) REFERENCES games(gameid) ON DELETE CASCADE,
    FOREIGN KEY (categoryid) REFERENCES category(categoryid),
    UNIQUE (gameid, categoryid)
);

CREATE TABLE `gamesByPlatform` (
	`gameid` INT NOT NULL,
    `platformid` INT NOT NULL,
    `price` FLOAT NOT NULL,
    `points` INT NOT NULL,
    FOREIGN KEY (gameid) REFERENCES games(gameid) ON DELETE CASCADE,
    FOREIGN KEY (platformid) REFERENCES platform(platformid),
    UNIQUE (gameid, platformid)
);


-- ====================================================================
-- inserting :/
-- ====================================================================

-- users

INSERT INTO users (username, password, email, member_type, points, profile_picture_url) 
VALUES
("bobbyswag", "1qwer$#@!", "bobbyLovesGaming@gmail.com", "Diamond", "500", "https://cloud_space/bobby_tan/PFP"),
("TommyBoyBoy", "tombb", "Tommy21@gmail.com", "Bronze", "100", "https://abcd/Tommy_picture"),
("Jennyyy", "jennylovekpop", "BPJenny@gmail.com", "Silver", "1600", "https://xyz/Jenny_Lim_Picture"),
("BobDaBuilder", "Password123", "BuildingBob@gmail.com", "Gold", "3100", "https://cloud_space/Bob/PFP"),
("KaiQing69", "KaiQing69", "KaiQingGames@gmail.com", "Diamond", "6000", "https://cloud_space/KohKaiWing/PFP"),
("WenQing101", "2dunwo#%nd", "WenQingWork@workspace.com", "Admin", "0", "https://cloud_space/AiWen/PFP"),
("Shodan29", "shodanshowho", "JackMah@gmail.com", "Bronze", "1100", "https://image_cloud/Shodan29/shodan29_image"),
("time0ut", "t1Me0uT", "time0ut@gmail.com", "Diamond", "8888", "https://cloud_space/time0ut/PFP"),
("PeterLim", "weori2*d#4", "PeterLim@workspace.com", "Admin", "0", "https://image_cloud/PeterLimOngOng/peterlim_image"),
("mingKai", "mingKaiGaming", "GamingWMK@gmail.com", "Silver", "1800", "https://AMK/picture"),
("MommySage", "1qwer$#@!", "GamingWithSages@gmail.com", "Gold", "3200", "https://image_cloud/Sage/sage_image"),
("pyoyjk", "kjyoyp", "pyoyjk@gmail.com", "Gold", "2500", "https://image_cloud/pyoyjk/pyoyjk_image"),
("Zaptros", "zapzapzapBOOM", "GH@gmail.com", "Diamond", "7000", "https://image_cloud/Zaptros/zaptros_image"),
("Rayquaza22", "KoreanBoi", "RayRay@gmail.com", "Bronze", "1100", "https://cloud_space/Rayquaza22/PFP"),
("EL", "ELLE123321", "EL@gmail.com", "Gold", "4000", "https://cloud_space/EL/PFP"),
("souless", "vEry_sECuRe", "souless@gmail.com", "Member", "0", "https://image_cloud/souless/souless_image"),
("milet", "miletXMWM", "milet@gmail.com", "Diamond", "7100", "https://image_cloud/milet/milet_image"),
("UltraRaptor", "qeuoh3", "UltraRaptor@gmail.com", "Silver", "1800", "https://cloud_space/UltraRaptor/UltraRaptor_image"),
("admin", "admin", "admin@gmail.com", "Admin", "0", "admin");


-- games

INSERT INTO games (title, description, year)
VALUES
("Valorant", "5v5 shooter by Riot Games", "2020"),
("League of Legends", "Multiplayer online battle arena game", "2009"),
("Minecraft", "Open-world sandbox survival game", "2011"),
("Fortnite", "Battle royale shooter with building", "2017"),
("Splatoon 2", "Epic quest with magical challenges", "2017"),
("Resident Evil 4", "Intense survival horror action", "2023"),
("Borderlands", "Wild, chaotic, loot-filled mayhem", "2019"),
("Rocket League", "Thrilling soccer with rocket-powered cars", "2015"),
("Halo: The Master Chief Collection", "Epic sci-fi shooter collection", "2014"),
("Gears of War 2", "Intense, gritty, cooperative battles", "2008"),
("Forza Horizon 4", "Open-world racing extravaganza", "2018"),
("The Elder Scrolls V: Skyrim", "Vast fantasy adventure awaits", "2011"),
("Animal Crossing: New Horizons", "Relaxing island life simulation game", "2020"),
("Fall Guys", "Fun multiplayer obstacle course game.", "2020"),
("Super Smash Bros. Ultimate", "Massive crossover fighting extravaganza", "2018"),
("Mario Kart 8 Deluxe", "Fast-paced multiplayer racing fun", "2017"),
("God of War", "Epic mythological action-adventure with Kratos", "2018"),
("The Last of Us Part II", "Gripping post-apocalyptic survival journey", "2020"),
("Horizon Zero Dawn", "Open-world robotic dinosaur hunting", "2017"),
("Overwatch", "Team-based multiplayer hero shooter", "2016"),
("Stardew Valley", "Charming farming and life simulation", "2016"),
("Grand Theft Auto V", "Open-world crime and chaos", "2013"),
("The Witcher 3: Wild Hunt", "Epic fantasy RPG adventure", "2015");

-- category

INSERT INTO category (categoryname, description)
VALUES
("FPS", " Intense action, skill-based combat"),
("MOBA", "Strategic team-based battles, competitive gameplay"),
("Sandbox", "Creative freedom, open-world exploration"), 
("Survival", "Challenging, resource management, survival skills"),
("Adventure", "Exciting quests, exploration, immersive storytelling"),
("Battle Royale", "Last one standing, intense competition"),
("RPG", "Character progression, immersive storytelling"),
("Survival Horror", "Tense atmosphere, frightful encounters"),
("Sports", "Realistic gameplay, competitive sportsmanship"),
("Racing", "High-speed thrills, adrenaline-fueled races"),
("Third-person Shooter", "Over-the-shoulder action, tactical combat"),
("Life Simulation", "Virtual world, everyday activities"),
("Fighting", "Dynamic combat, skilled fighters"),
("Crossover", "Mashup of different characters/franchises"),
("Open World", "Expansive, non-linear gameplay"),
("Farming", "Cultivate crops, raise livestock");

-- platform

INSERT INTO platform (platformname, description)
VALUES
("PC", "Limitless gaming possibilities, customizable experience"),
("PlayStation", "Immersive gaming with exclusive titles"),
("XBox", "Gaming and entertainment powerhouse"),
("Nintendo Switch", "Portable gaming fun for everyone");

-- Review

INSERT INTO review (userid, gameid, content, rating)
VALUES
("1", "11", "amazing graphics", "5"),
("2", "13", "casual and fun", "3"), 
("3", "8", "too many popups", "2"), 
("4", "15", "pretty fun", "3"), 
("5", "17", "its ok", "1"),
("7", "8", "sound effects and music not playing", "2"), 
("8", "6", "pls fix the bugs", "1"), 
("10", "11", "one of the most awesome games", "5"), 
("11", "20", "more freebies pls", "4"), 
("12", "2", "love the new updates", "3"), 
("13", "14", "very good", "4"), 
("14", "10", "many features in the game", "4"), 
("15", "3", "cute animation", "5"), 
("17", "14", "i love this game so much", "5"), 
("18", "12", "its the best", "4"),
("5", "11", "it is so much fun", "5"), 
("4", "3", "the sheer amount of ads totally kills the experience", "1"), 
("3", "21", "love the beautiful 3d scenery", "4"), 
("1", "10", "best game to play on phone", "5"), 
("8", "14", "10/10 would recommend it", "3"), 
("10", "5", "the approach and gameplay is challenging and fun", "5"), 
("11", "5", "i like to play it during free time", "3");

-- userGames

INSERT INTO userGames (userid, gameid, platformid)
VALUES
("1", "11", "1"),
("1", "10", "1"),
("1", "1", "1"),
("1", "21", "1"),
("2", "13", "4"),
("3", "8", "3"),
("3", "21", "2"),
("4", "15", "4"),
("4", "3", "3"),
("4", "19", "3"),
("5", "17", "3"),
("5", "11", "1"),
("5", "20", "1"),
("7", "8", "4"),
("8", "6", "2"),
("8", "14", "4"),
("8", "16", "4"),
("8", "10", "2"),
("10", "11", "1"),
("10", "16",  "4"),
("11", "20", "3"),
("11", "5", "4"),
("11", "4", "3"),
("12", "2", "1"),
("12", "9", "1"), 
("13", "14", "4"),
("13", "15", "4"),
("13", "7", "4"),
("14", "10", "1"),
("15", "3", "3"),
("15", "21", "4"),
("17", "14", "4"), 
("17", "3", "4"),
("17", "9", "1"),
("18", "12", "1"),
("18", "6", "1");

-- gamesImage
INSERT INTO gamesImage(gameid, filepath)
VALUES
("1", "/images/Valorant"),
("2", "/images/League of Legends"),
("3", "/images/Minecraft"),
("4", "/images/Fortnite");

-- gamesByCategory

INSERT INTO gamesByCategory (gameid, categoryid)
VALUES
("1", "1"),
("2", "2"),
("3", "3"),
("3", "4"),
("3", "5"),
("4", "6"),
("5", "16"),
("5", "8"),
("6", "5"),
("6", "9"),
("7", "1"),
("7", "8"),
("8", "10"),
("8", "11"),
("9", "1"),
("10", "12"),
("11", "10"),
("11", "9"),
("12", "8"),
("12", "16"),
("13", "13"),
("14", "8"),
("14", "16"),
("15", "14"),
("15", "15"),
("16", "11"),
("17", "5"),
("18", "4"),
("18", "5"),
("19", "8"),
("19", "16"),
("20", "1"),
("21", "13"),
("21", "5"),
("22", "5"),
("22", "16"),
("23", "8"),
("23", "16");

-- gamesByPlatform

INSERT INTO gamesByPlatform (gameid, platformid, price, points)
VALUES
("1", "1", "19.90", "350"),
("2", "1", "21.90", "300"),
("3", "1", "30", "600"),
("3", "2", "29.90", "450"),
("3", "3", "24.90", "600"),
("3", "4", "14.90", "200"),
("4", "1", "5.90", "100"),
("4", "2", "8.90", "200"),
("4", "3", "9.90", "250"),
("4", "4", "4.90", "150"),
("5", "4", "89.90", "1400"),
("6", "1", "15.90", "650"),
("6", "2", "12.50", "500"),
("6", "3", "12.50", "550"),
("6", "4", "9.90", "300"),
("7", "1", "2.90", "100"),
("7", "2", "3", "100"),
("7", "3", "2.90", "150"),
("7", "4", "1.90", "100"),
("8", "1", "1.90", "100"),
("8", "2", "1", "100"),
("8", "3", "1.90", "150"),
("8", "4", "0.90", "100"),
("9", "1", "59.90", "800"),
("9", "2", "56.90", "700"),
("10", "1", "64.90", "800"),
("10", "2", "59.90", "650"),
("11", "1", "39.90", "500"),
("11", "2", "34.90", "300"),
("12", "1", "69.90", "1000"),
("12", "2", "69.90", "800"),
("12", "3", "69.90", "850"),
("12", "4", "59.90", "1000"),
("13", "4", "14.90", "500"),
("14", "4", "85.90", "1300"),
("15", "4", "60", "700"),
("16", "4", "59.90", "800"),
("17", "3", "74.90", "1200"),
("18", "3", "24.90", "500"),
("19", "1", "19.90", "500"),
("19", "3", "21", "500"),
("20", "1", "29.90", "650"),
("20", "2", "24.90", "400"),
("20", "3", "26", "550"),
("20", "4", "19.90", "800"),
("21", "1", "14.90", "300"),
("21", "2", "9.90", "200"),
("21", "3", "9.90", "200"),
("21", "4", "12.90", "300"),
("22", "1", "30.90", "450"),
("22", "2", "29.90", "400"),
("22", "3", "30", "400"),
("23", "1", "74.90", "1000"),
("23", "2", "70.90", "1000"),
("23", "3", "65.90", "900"),
("23", "4", "70.90", "1100");

-- Thanos Snap
-- DROP DATABASE sp_games