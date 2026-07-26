-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 28, 2026 at 01:45 PM
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
-- Database: `deepam_kesari`
--

-- --------------------------------------------------------

--
-- Table structure for table `authors`
--

CREATE TABLE `authors` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `photo` varchar(1024) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `role` varchar(100) DEFAULT 'Author',
  `academic_pedigree` varchar(500) DEFAULT NULL,
  `creative_focus` varchar(500) DEFAULT NULL,
  `performing_arts` varchar(500) DEFAULT NULL,
  `literary_vision` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `authors`
--

INSERT INTO `authors` (`id`, `name`, `photo`, `bio`, `role`, `academic_pedigree`, `creative_focus`, `performing_arts`, `literary_vision`) VALUES
(4, 'Deep Patel', '/public\\assets\\images\\auther.jpeg', 'Rooted in values and inspired by life itself, Deep Patel is a writer and publisher at Deepam Kesari Publishing House. He writes with the intention of preserving culture, expressing genuine human emotions, and encouraging positive change through meaningful literature.', 'Author', 'Master\'s degree in Science (M.Sc.) with specialization in Organic Chemistry', 'Gujarati Literature & Culture', 'Navodit Artist in Lokdayra', 'Writing is not merely a profession but a responsibility—to reflect truth, inspire courage, and create stories that leave a thoughtful and lasting impact on readers across generations.');

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `cover_image` varchar(1024) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `isbn` varchar(50) DEFAULT NULL,
  `amazon_link` varchar(1024) DEFAULT NULL,
  `whatsapp_link` varchar(1024) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `language` varchar(100) DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author_id`, `cover_image`, `description`, `isbn`, `amazon_link`, `whatsapp_link`, `category`, `language`, `featured`, `created_at`) VALUES
(6, 'રસ્તો કરી જવાના', 4, '\\public\\assets\\images\\front_cover_rasto_kari_javana.jpg', '\" રસ્તો કરી જવાના \" - આ માત્ર એક નવલકથા નથી , આ એ દરેક વ્યક્તિની કહાની છે કે જે જીવનમાં વારંવાર નિષ્ફળતા , નિરાશા અને અંધકારનો સામનો કરી રહ્યા છે. \r\n\r\nમિડલ ક્લાસ પરિવારના યુવાનો / યુવતીઓ પોતપોતાના ક્ષેત્રમાં સફળ થવા માટે મોટા સપનાઓ માથે લઈને દોડતા રહે છે. પણ જીવનના દરેક વળાંક પર નિષ્ફળતાઓ , અપેક્ષાઓનો ભાર અને સમાજના તીખા શબ્દો વચ્ચે ઘેરાઈ જતા હોય ત્યારે શું ??? \r\n\r\nપરીક્ષાઓમાં નિષ્ફળતા...\r\nઘરની પરિસ્થિતિનું દબાણ...\r\nલોકોની તુલનાઓ અને......\r\nસમાજમાં પોતાને શ્રેષ્ઠ સાબિત કરવાની આકરી માંગ  હોય ત્યારે એક એવા અંધકારમાં આપણે ભૂલા પડી જતા હોઈએ છીએ કે ત્યાંથી નીકળવાનો આપણને રસ્તો પણ દેખાતો નથી.\r\n\r\nતે સમયે પોતાને  પ્રશ્નો થાય છે કે-- \r\n\r\n\" શું હું ખરેખર કંઈ કામનો નથી ? \" \r\n\" શું હું મારા પરિવાર પર બોજ બનતો જઈ રહ્યો છું ? \"\r\n\" શું હું આવા અંધારામાં જ ડૂબેલો રહીશ ? \"\r\n\"શું હું મારા જીવનમાં આમ દિશાહીન બનીને ભટકતો જ રહીશ ? \" \r\n\" શું હું આ દુનિયા પર માત્ર હરીફાઈઓમાં જીતીને પોતાને સર્વશ્રેષ્ઠ સાબિત કરવા આવ્યો છું ? \"\r\n\r\nજો તમે આવા સવાલોરૂપી કરોળિયાના જાળામાં ફસાયા હોય , જો નિષ્ફળતાઓ અને નિરાશાના અંધકારમાં ડૂબ્યા હોય તો \" રસ્તો કરી જવાના \" નવલકથા તમને આવા કઠિન સમયમાં સાથ આપશે , તમારી સંગાથે રહીને , અંધકારમાં જ્વલંત મશાલ બનીને તમને \" રસ્તો \" બતાવશે. સવાલોનું પાંજરું તોડીને તમને ઉડવા માટે વિરાટ આકાશ આપશે. આ નવલકથા તમારો \" છેવટ સુધી \" નો મિત્ર બનશે.\r\n\r\n\" રસ્તો કરી જવાના \" માત્ર નવલકથા નહીં પરંતુ એક એવી મહાયાત્રા કે જે તમને તમારા મૂળ સુધી લઈ જશે.', '978-81-989452-2-8', 'https://amzn.in/d/03abeR2d', 'https://bit.ly/Rasto-Kari-Javana-Novel', 'Fiction', 'Gujarati', 1, '2026-05-12 15:22:29');

-- --------------------------------------------------------

--
-- Table structure for table `contact_requests`
--

CREATE TABLE `contact_requests` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `event_date` date DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `image` varchar(1024) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `details` text DEFAULT NULL,
  `category` varchar(100) DEFAULT 'Event',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `event_date`, `location`, `image`, `description`, `details`, `category`, `created_at`) VALUES
(1, 'Book Launch & Reading Circle', '2025-05-12', 'Ahmedabad, Gujarat', '/assets/images/BOOK_STACK.jpeg', 'An evening of author reflections, live readings, and conversation with readers.', 'The event featured a live reading from the latest release, a panel discussion, and a Q&A session with the authors and audience.', 'Launch Event', '2026-06-21 06:14:40'),
(2, 'Literary Festival Showcase', '2025-06-28', 'Rajkot, Gujarat', '/assets/images/BOOK_STACK2.jpeg', 'A vibrant celebration of storytelling, poetry, and emerging voices from across India.', 'Visitors enjoyed poetry readings, book stalls, interactive workshops, and networking among authors, publishers, and readers.', 'Festival', '2026-06-21 06:14:40'),
(3, 'Children\'s Story Session', '2025-08-08', 'Vadodara, Gujarat', '/assets/images/books.jpeg', 'Interactive reading sessions designed to inspire young readers and families.', 'The session included storytelling, drawing activities, and a fun discussion about creativity and books for children.', 'Community Event', '2026-06-21 06:14:40');

-- --------------------------------------------------------

--
-- Table structure for table `event_gallery_images`
--

CREATE TABLE `event_gallery_images` (
  `id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `image` varchar(1024) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_gallery_images`
--

INSERT INTO `event_gallery_images` (`id`, `event_id`, `image`, `caption`, `created_at`) VALUES
(1, 1, '/assets/images/BOOK_STACK.jpeg', 'Readers at the launch event', '2026-06-21 06:14:40'),
(2, 1, '/assets/images/BOOK_STACK2.jpeg', 'Book display table', '2026-06-21 06:14:40'),
(3, 2, '/assets/images/books.jpeg', 'Author interaction at festival', '2026-06-21 06:14:40'),
(4, 2, '/assets/images/IMG_20250506_113923.png', 'Audience listening in a seminar', '2026-06-21 06:14:40'),
(5, 3, '/assets/images/NAME_LOGO.jpeg', 'Workshop participants', '2026-06-21 06:14:40'),
(6, 3, '/assets/images/logo.png', 'Launch ceremony', '2026-06-21 06:14:40');

-- --------------------------------------------------------

--
-- Table structure for table `manuscripts`
--

CREATE TABLE `manuscripts` (
  `id` int(11) NOT NULL,
  `author_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `rating` int(1) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `book_id`, `user_name`, `rating`, `comment`, `created_at`) VALUES
(2, 6, 'Ronak Patel', 5, 'Very inspiring collection. Must read for every literature lover.', '2026-05-12 15:22:30'),
(4, 6, 'Mili Patel', 4, 'દરેક વ્યક્તિએ ચોક્કસ વાંચવા જેવું - સાચે જ એક પ્રેરણાદાયી અને અદભુત પુસ્તક.\r\nખૂબ જ અદભુત પુસ્તક! \'રસ્તો કરી જવાના\' એ માત્ર એક વાર્તા કે પુસ્તક નથી; આ એક એવો અનુભવ છે જે તમને મુશ્કેલ સમયમાં ટકી રહેવાની શક્તિ અને આશા આપે છે. લેખકે જટિલ લાગણીઓને ખૂબ જ સરળ અને વાંચવી ગમે તેવી શૈલીમાં રજૂ કરી છે જે ખરેખર પ્રશંસનીય છે. આ પુસ્તક જીવનના સાચા સંઘર્ષો સાથે જોડાય છે અને આપણને ક્યારેય હાર ન માનવાનું માર્ગદર્શન આપે છે. આ એક એવી શ્રેષ્ઠ રચના છે જે દરેક વ્યક્તિએ જીવનમાં એકવાર તો જરૂર વાંચવી જ જોઈએ. આ પુસ્તક વાંચવાનું બિલકુલ ચૂકશો નહીં!', '2026-05-12 15:22:30'),
(5, 6, 'Rohan Gupta', 5, 'Deepam Kesari brings out the most authentic literature. Their attention to detail in translation is impeccable. Very inspiring collection. Must read for every literature lover.', '2026-05-12 15:22:30'),
(6, 6, 'Dhaval Kataria', 5, 'Over the long weekend..\r\nA beautiful book by Deep Patel', '2026-05-12 15:22:30'),
(7, 6, 'Bimal Patel', 4, 'ખુબ મહત્વનો વિષય હોવા છતાં પણ ક્યાય પણ નાં લખાયું હોય એવું નવલકથા સ્વરૂપે લખાયેલું પુસ્તક એટલે \"રસ્તો કરી જવાના\" - યુવાનો માટે બેસ્ટ માર્ગદર્શિકા...', '2026-05-12 15:22:30'),
(8, 6, 'M N Patel', 4, 'તમારી book હજું થોડી જ વાંચી છે પણ તેની શરૂઆત જ બહુ હૃદયસ્પર્શી છે, એમાંનો બળાપો પાર્ટ જ્યારે વાંચ્યો ત્યારે j હૃદય ભરાઈ આવ્યું હતું... ગઈકાલે મેં સંતોક માં વાળો part વાંચ્યો seriously bt એ વાંચી ને એવું લાગ્યું કે ખાલી ખોટુ આપણે આપણા દુઃખને આટલું મોટું માની લઈએ છીએ, ક્યારેક એવું લાગતું હોય છે કે જાણે ભગવાન મારી સાથે j કેમ આવું કરે છે.. અને મારી પ્રાર્થનાં તો સાંભળતો j નથી એવી ફરિયાદ પણ આપણે ભગવાન ને કરતાં હોઈએ છીએ.. પણ આ ભાગ વાંચીને સમજાણું કે દુનિયામાં એવાં ઘણાં લોકો છે જેને ઘણી તકલીફ છે છતાં પણ તેઓ સુખે થી જીવે છે... અને આપણે વગર કારણે j દુઃખી રહીએ છીએ...\r\n\r\nએમાંથી જિંદગી વિષે બહુ સરસ મોટીવેશન મળે છે ... Aspirants mate તો બહુ સારી બુક છે', '2026-05-12 15:22:30'),
(9, 6, 'katakiya Nikunj', 5, 'દોસ્તો આ નવલકથા એટલે એક એવી નવલકથા જે અત્યારે લગભગ બધાય નવયુવાનો ના સવાલો ના જવાબો ની સચોટ માહિતી પુરી પાડવા માટેનું સક્ષમ પુસ્તક... જે યુવાનો ના મન મા ચાલી રહેલા વિચારો ના વિંટોળાં ને સમાવી લેય...અને એકમાત્ર એવી નવલકથા જે નવલકથા મા એ નવલકથા નો ઉલ્લેખ હોઈ જે નવલકથા તમે વાંચી રહ્યા છો... અદ્ભૂત!!!\r\n\r\nનવલકથા ના મુખ્ય પાત્ર રાઘવ સાથે જેમ જેમ મુસાફરી કરશો એમ એમ લાગશે કે જાણે આપડે જ મુસાફરી કરી રહ્યા હોઈએ...આ બુક તમને બધુજ શીખશે -મિત્રતા, નિખાલસતા, નિઃસ્વાર્થ પ્રેમ ને એક એવુ ચારિત્ર જે લગભગ ભ્રમણયાત્રા સિવાય મેળવવું અશક્ય છે...\r\n\r\nગુજરાત ના નવયુવાનો જે સ્પર્ધાત્મક પરીક્ષા ની તૈયારી કરી રહ્યા છે એમને એક મારી નમ્ર અપીલ છે કે તમે એકવાર આ નવલકથા અચૂક વાંચો...તમારા બધા સવાલો ના જવાબ આ નવલકથા આપમેળે આપતી જશે...\r\n\r\nઅને નવલકથા ના અંત મા તમે પહેલા જેવા બિલકુલ નહીં રયો...અને એક હું વાત દાવા સાથે કઈ શકું કે ઈ શકું કે આ પુસ્તક વાંચ્યા પછી આવતા વિચારો મા એક વિચાર એ હશે કે તમે પૈલા જે વિચારો કરતા એમાના 90% વિચારો નિરર્થક હતા....\r\n\r\nમને આ નવલકથા personally એટલે ગમે કેમ કે આ પુસ્તક મા મિત્રતા નો ઉલ્લેખ અલગ લેવેલે થયો છે... ને એ કોઈ જેવી તેવી મિત્રતા નય... એકદમ બાળપણ થી અંત સુધી ની ગાઢ મિત્રતા...\r\n\r\nઆ વર્ષે પોતાના માટે જો કોઈ બેસ્ટ ભેટ હોઈ તો આ નવલકથા -\"રસ્તો કરી જવાના\"', '2026-05-12 15:22:30'),
(10, 6, 'Reader', 5, 'હાલમાં મેં આપની નવલકથા “રસ્તો કરી જવાના” વાંચી અને સાચું કહું તો આ માત્ર એક નવલકથા નથી, પરંતુ જીવનને સમજાવતી એક સુંદર સફર છે. પુસ્તક પૂર્ણ કર્યા પછી પણ તેના વિચારો અને ભાવનાઓ મનમાં સતત જીવંત રહે છે.\r\n\r\nઆપે ખૂબ જ સરળ પરંતુ દિલને સ્પર્શે તેવી ભાષામાં જે રીતે જીવનના સંઘર્ષ, સ્વપ્નો અને પોતાના રસ્તા બનાવવાની વાત રજૂ કરી છે, તે ખરેખર પ્રશંસનીય છે. આજના સમયમાં જ્યારે ઘણા યુવાનો દિશા અને આત્મવિશ્વાસ શોધી રહ્યા છે, ત્યારે આ નવલકથા તેમને એક નવી દૃષ્ટિ આપે છે.\r\n\r\nપુસ્તકના અનેક ભાગો અને વાક્યો એવા છે જે સીધા દિલ સુધી પહોંચી જાય છે અને વાંચકને પોતાના જીવન વિશે વિચારવા મજબૂર કરે છે. ખાસ કરીને, “પોતાનો રસ્તો બનાવવાની હિંમત” અને “પરિસ્થિતિઓ સામે ન ઝુકવાની ભાવના” જે રીતે તમે વ્યક્ત કરી છે, તે મને ખૂબ જ પ્રેરણા આપી ગઈ. એવું લાગે છે કે આ પુસ્તક માત્ર વાંચવા માટે નથી, પરંતુ જીવવા માટે છે.\r\n\r\nજ્યારે આખું પુસ્તક વાંચ્યું, ત્યારે સમજાયું કે દરેક વાક્ય પાછળ કેટલી ઊંડી લાગણી અને વિચાર છુપાયેલો છે.\r\n\r\nઆવી સુંદર કૃતિ માટે આપનો દિલથી આભાર', '2026-05-12 15:22:30'),
(11, 6, 'Reader', 5, '“આ નવલકથા વાંચીને ખૂબ આનંદ આવ્યો. સુંદર લેખન માટે દિલથી આભાર.”\r\n\r\n“કથાનક ખૂબ રસપ્રદ અને પ્રેરણાદાયક લાગ્યો. આવું ઉત્તમ પુસ્તક આપવા બદલ આભાર.”\r\n\r\n“તમારી નવલકથાએ શરૂઆતથી અંત સુધી બાંધી રાખ્યો. પાત્રોની રજૂઆત અને ભાષા ખૂબ અસરકારક લાગી. આવું સુંદર સાહિત્ય આપવા બદલ હાર્દિક આભાર.”\r\n\r\n“આ પુસ્તકમાંથી ઘણું શીખવા મળ્યું અને વાંચનનો આનંદ મળ્યો. આપના સર્જન માટે અભિનંદન અને આભાર.” “અદ્ભુત નવલકથા! એકવાર હાથમાં લીધી પછી મૂકવી મુશ્કેલ થઈ ગઈ. લેખકશ્રી દીપભાઈ નો ખુબ ખુબ આભાર.”', '2026-05-12 15:22:30');

-- --------------------------------------------------------

--
-- Table structure for table `subscribers`
--

CREATE TABLE `subscribers` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subscribed_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subscribers`
--

INSERT INTO `subscribers` (`id`, `email`, `subscribed_at`) VALUES
(1, 'patelmili42@gmail.com', '2026-05-20 16:44:49'),
(2, 'deepamkesari1998@gmail.com', '2026-05-20 16:44:49');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `authors`
--
ALTER TABLE `authors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_author` (`author_id`);

--
-- Indexes for table `contact_requests`
--
ALTER TABLE `contact_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_gallery_images`
--
ALTER TABLE `event_gallery_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_event_gallery` (`event_id`);

--
-- Indexes for table `manuscripts`
--
ALTER TABLE `manuscripts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_review_book` (`book_id`);

--
-- Indexes for table `subscribers`
--
ALTER TABLE `subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `authors`
--
ALTER TABLE `authors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `contact_requests`
--
ALTER TABLE `contact_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `event_gallery_images`
--
ALTER TABLE `event_gallery_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `manuscripts`
--
ALTER TABLE `manuscripts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `subscribers`
--
ALTER TABLE `subscribers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `fk_author` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `event_gallery_images`
--
ALTER TABLE `event_gallery_images`
  ADD CONSTRAINT `fk_event_gallery` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_review_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
