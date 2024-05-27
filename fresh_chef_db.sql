-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Май 27 2024 г., 14:41
-- Версия сервера: 8.0.30
-- Версия PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `fresh_chef_db`
--

-- --------------------------------------------------------

--
-- Структура таблицы `dishes`
--

CREATE TABLE `dishes` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `short_description` varchar(255) NOT NULL,
  `img` varchar(255) NOT NULL,
  `amount` int NOT NULL,
  `price` int NOT NULL,
  `total_quantity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `dishes`
--

INSERT INTO `dishes` (`id`, `title`, `short_description`, `img`, `amount`, `price`, `total_quantity`) VALUES
(1, 'Вегетарианские бургеры', 'с майонезом Карри и картофелем фри', '/img/dishes/vibrant_veggie_burgers.jpg', 300, 499, 25),
(2, 'Тако с манго и черной фасолью', 'с обжаренным луком и авокадо', '/img/dishes/tacos_mango.jpg', 175, 349, 20),
(3, 'Макароны Мафальдин', 'с кремом из кешью с чесноком', '/img/dishes/mafaldine_pasta.jpg', 240, 469, 5),
(4, 'Салат из кукурузы и белой фасоли', 'с авокадо', '/img/dishes/corn_salad.jpg', 235, 339, 17),
(5, 'Миски с тофу с миндальным маслом', 'с обжаренными цуккини и Бок-Чой', '/img/dishes/tofu_bowl.jpg', 250, 279, 6),
(6, 'Миска зерен Romesco', 'с обжаренными на сковороде грибами', '/img/dishes/romesco.jpg', 310, 429, 10),
(7, 'Запеченные лепешки из брокколи', 'с сыром кешью и рукколой', '/img/dishes/broccolli.jpg', 280, 189, 11);

-- --------------------------------------------------------

--
-- Структура таблицы `dish_info`
--

CREATE TABLE `dish_info` (
  `id` int NOT NULL,
  `id_dish` int NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `calories` int NOT NULL,
  `fat` int NOT NULL,
  `carbohydrates` int NOT NULL,
  `protein` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `dish_info`
--

INSERT INTO `dish_info` (`id`, `id_dish`, `description`, `calories`, `fat`, `carbohydrates`, `protein`) VALUES
(1, 1, 'Карри в порошке по-мадрасски идеально сочетается с этими полезными овощными бургерами на морковной основе. Пикантный маринованный халапеньо в сочетании с острой рукколой делают это блюдо с высоким содержанием белка еще более пикантным.', 720, 25, 108, 15),
(2, 2, 'Обжаренный лук и манговый чатни придают пикантную сладость этим тако. Благодаря белку и клетчатке из черной фасоли они надолго придадут вам сил и ощущение сытости.', 670, 18, 113, 25),
(3, 3, 'Это блюдо из пасты с насыщенным сливочным вкусом не содержит натрия и богато белком. Лук-порей слегка обжаривается, пока он не станет сладким, сочным и мягким. Свежий эстрагон придает нежный вкус лакрицы сырно-сливочному соусу и рукколе с перцем.', 660, 32, 76, 21),
(4, 4, 'Ничто так не напоминает о лете, как свежая сладкая кукуруза прямо в початках. Хрустящие огурцы и ромен, сливочный авокадо и масляная фасоль - идеальное сочетание для приготовления этого летнего салата с высоким содержанием натрия, белка и клетчатки, который содержит менее 600 калорий.', 600, 27, 69, 24),
(5, 5, 'Небольшое количество сахара в пикантном кунжутно-миндальном соусе способствует карамелизации в процессе приготовления, придавая нежным кубикам тофу аппетитную хрустящую корочку. Мы подаем это блюдо с острым редисом, сочными обжаренными цуккини и бок-чой, а также с пышным рисом, посыпанным киноа.', 620, 24, 69, 34),
(6, 6, 'Ромеско - это пикантный соус из каталонского региона Испании, обычно состоящий из молотого поджаренного миндаля, запеченного красного перца, помидоров, красного винного уксуса и чеснока. Чтобы сделать наш ромеско доступным для тех, у кого аллергия на орехи, мы заменили миндаль семенами подсолнечника. Этот дымчатый сладкий соус прекрасно сочетается с земляными грибами и сливочно-масляной фасолью в этих зерновых мисках. Для получения хрустящего и освежающего послевкусия мы поливаем нежные кусочки цуккини лимонным соусом.', 580, 20, 73, 21),
(7, 7, 'Сумах - это пряность, которую готовят из измельченных красных ягод с лимонным вкусом. Он широко используется в кухнях Ближнего Востока и Восточной части Средиземноморья для придания блюдам цветочной терпкости. В сочетании с обжаренной брокколи, рукколой с перцем, сливочным хумусом и сыром кешью с ореховыми травами и чесноком это блюдо станет отличным дополнением к вашим любимым лепешкам.', 590, 20, 83, 26);

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `id_user` int NOT NULL,
  `id_dish` int NOT NULL,
  `quantity` int NOT NULL,
  `number_current_order` int NOT NULL,
  `is_finished` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id`, `id_user`, `id_dish`, `quantity`, `number_current_order`, `is_finished`) VALUES
(39, 2, 4, 5, 1, 1),
(40, 2, 6, 3, 1, 1),
(41, 2, 5, 2, 1, 1),
(42, 2, 2, 1, 2, 1),
(43, 2, 3, 1, 2, 1),
(44, 6, 1, 5, 1, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `reviews`
--

CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `id_user` int NOT NULL,
  `review` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `theme` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `reviews`
--

INSERT INTO `reviews` (`id`, `id_user`, `review`, `theme`, `phone`) VALUES
(1, 7, 'Спасибо за отличный сервис! Всё было на высшем уровне.', 'Отзыв', '+7(900)123-45-67'),
(2, 9, 'Было бы здорово, если бы вы добавили больше вегетарианских блюд в меню.', 'Предложение', '+7(900)765-43-21'),
(3, 6, 'Заказ пришел с опозданием, но еда была вкусной.', 'Жалоба', '+7(900)456-78-90');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `is_admin` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `number_current_order` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `is_admin`, `name`, `email`, `password`, `number_current_order`) VALUES
(1, 1, 'Admin', 'root@gmail.com', 'root123', 1),
(2, 0, 'Максим Сидоров', 'maxs@gmail.com', 'max123', 3),
(6, 0, 'Илья Шамров', 'ilya66401@gmail.com', 'ilya123', 2),
(7, 0, 'Александр Иванов', 'alexandr.ivanov@gmail.com', 'sanya123', 1),
(8, 0, 'Дарина Лебедева', 'darina.lebedeva@mail.ru', 'darina_leb', 1),
(9, 0, 'Николай Козлов', 'nick_kozlov@mail.com', 'Tiger123', 1);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `dishes`
--
ALTER TABLE `dishes`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `dish_info`
--
ALTER TABLE `dish_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_dish` (`id_dish`);

--
-- Индексы таблицы `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_dish` (`id_dish`),
  ADD KEY `id_user` (`id_user`);

--
-- Индексы таблицы `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `dishes`
--
ALTER TABLE `dishes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT для таблицы `dish_info`
--
ALTER TABLE `dish_info`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT для таблицы `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT для таблицы `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `dish_info`
--
ALTER TABLE `dish_info`
  ADD CONSTRAINT `dish_info_ibfk_1` FOREIGN KEY (`id_dish`) REFERENCES `dishes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`id_dish`) REFERENCES `dishes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
