# Truck Fleet

**Система за управление на транспортни флоти**

## 1. Тема

Truck Fleet е интегрирана система, създадена за улесняване на ежедневните дейности на спедитори, шофьори и собственици на логистични компании. Основната цел на платформата е оптимизация на процеси като управление на поръчки, поддръжка на камиони и проследяване на доставките в реално време.

## 2. Резюме

### 2.1 Цели

**Проблеми:**

- Неефективна координация между различните звена в транспортния процес.
- Използването на три различни и несъвместими платформи за управление на поръчки, шофьори и камиони.
- Сухата и трудно интерпретируема информация в Excel таблици, което забавяше процесите и затрудняваше комуникацията.
- Ограничен достъп до данни в реално време за камионите (разход на гориво, обороти и др.).
- Дублиране на работа и загуба на време при обработката на данни.

**Решение:**

Truck Fleet предоставя три платформи за различни потребители:

1. **Уеб приложение** – за спедитори и администратори, включващо управление на поръчки, камиони и персонал и създаване на фактури.
2. **Мобилно приложение** – за шофьори, позволяващо проследяване на маршрути и комуникация в реално време.

Платформата ще включва и интеграция с OBD2 устройства, които предават данни за разхода на гориво и състоянието на камиона в реално време.

### 2.2 Основни етапи на реализация

1. **Планиране и анализ**
   - Идентифициране на основните нужди и предизвикателства на логистичните компании.
   - Анализ на конкурентните системи за управление на транспортни флоти.
2. **Дизайн и разработка**
   - Изграждане на уеб интерфейс с Next.js и React.
   - Създаване на мобилно приложение с Flutter за шофьори.
   - Разработка на модул за фактуриране с автоматизация на процесите.
3. **Тестване и оптимизация**
   - Функционално и интеграционно тестване.
   - Оптимизация на производителността и сигурността.
4. **Внедряване и поддръжка**
   - Разполагане на платформата чрез Firebase и Vercel.
   - Осигуряване на актуализации и техническа поддръжка.

### 2.3 Основни функционалности

- **Управление на поръчки** – добавяне, редактиране и проследяване на статуса на поръчките.
- **Фактуриране** – създаване на фактури с интегрирани опции за ДДС, валута, формат на дати и банкови данни.
- **Управление на камиони** – информация за пробег, сервизни интервали и технически състояния чрез OBD2.
- **Данни в реално време** – проследяване на разход на гориво, обороти (RPM) и местоположение чрез Google Maps API.
- **Комуникация** – интегриран чат за бързо взаимодействие между участниците в процеса.
- **Експорт на данни** – лесен износ на таблици и отчети във формати като Excel.

### 2.4 Използвани технологии

- **Frontend**: Next.js, React
- **Mobile**: Flutter
- **Backend**: Firebase (Auth, Firestore)
- **Допълнителни технологии**: Google Maps API, OBD2 интеграция

## Автор

**Калоян Стоянов Стоянов**

- Full-stack и мобилен разработчик
- Телефон: +359879900137
- Имейл: [kaloyangfx@gmail.com](mailto:kaloyangfx@gmail.com)
