import Script from 'next/script';
import { getGlobal } from '@/lib/strapi';

export const metadata = {
  metadataBase: new URL('https://vetnasvyaz.ru'),
};

const SERVICE_LINKS = [
  ['/uslugi-i-tseny', 'Все услуги'],
  ['/lechenie-koshek', 'Лечение кошек'],
  ['/lechenie-sobak', 'Лечение собак'],
  ['/vakcinaciya-priem-chipirovanie', 'Вакцинация и чипирование'],
  ['/laboratoriya-vns', 'Лаборатория'],
  ['/rentgen', 'Рентген'],
  ['/uzi', 'УЗИ'],
  ['/kardiologiya', 'Кардиология'],
  ['/dermatologiya-endokrinologiya', 'Дерматология'],
  ['/hirurgiya', 'Хирургия'],
  ['/hirurgicheskie-manipulyacii', 'Манипуляции'],
  ['/kastraciya-sterilizaciya', 'Кастрация и стерилизация'],
  ['/travmatologiya', 'Травматология'],
  ['/infuzionnaya-terapiya-kapelnitsy-ves', 'Наркоз и анестезия'],
  ['/stomatologiya', 'Стоматология'],
  ['/gruming', 'Груминг'],
];

export default async function RootLayout({ children }) {
  const global = (await getGlobal()) || {};
  const siteName = global.siteName || 'Ветеринар на связи';
  const tagline = global.tagline || 'ветеринарная клиника';
  const phone = global.phone || '+7 (495) 144-48-03';
  const phoneHref = global.phoneHref || 'tel:+74951444803';
  const menu = global.menu || [
    { label: 'Главная', href: '/' },
    { label: 'О компании', href: '/o-kompanii' },
    { label: 'Услуги и цены', href: '/uslugi-i-tseny' },
    { label: 'Вакансии', href: '/vakansii' },
    { label: 'Новости', href: '/novosti' },
    { label: 'Контакты', href: '#contacts' },
  ];

  return (
    <html lang="ru">
      <head>
        <meta name="robots" content="all" />
        <link rel="preload" href="/open_sans-r.woff2" as="font" crossOrigin="anonymous" />
        <link rel="preload" href="/open_sans-b.woff2" as="font" crossOrigin="anonymous" />
        <link rel="preload" href="/montserrat-b.woff2" as="font" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="stylesheet" href="/design-in3p88t1t-1600832236_styles.css" />
        <link rel="stylesheet" href="/index-skolkovo.css" />
      </head>
      <body className="vetnas-concept">
        <div className="concept-page">
          <header className="concept-topbar">
            <div className="concept-shell concept-nav">
              <a className="concept-brand" href="/">
                <img src="/logo-1.gif" alt={`Логотип ветеринарной клиники ${siteName}`} />
                <b>
                  {siteName} <span>{tagline}</span>
                </b>
              </a>
              <nav className="concept-menu" aria-label="Навигация">
                {menu.map((m, i) => (
                  <a key={i} href={m.href}>
                    {m.label}
                  </a>
                ))}
              </nav>
              <a className="concept-phone" href={phoneHref}>
                {phone}
              </a>
            </div>
          </header>

          <details className="concept-side-menu" aria-label="Меню сайта">
            <summary className="concept-side-menu__trigger">
              <span>Меню</span>
            </summary>
            <div className="concept-side-menu__panel">
              <a className="concept-side-menu__main" href="/">Главная</a>
              <a className="concept-side-menu__main" href="/o-kompanii">О компании</a>
              <details className="concept-side-menu__group">
                <summary>Услуги и цены</summary>
                <div className="concept-side-menu__links">
                  {SERVICE_LINKS.map(([href, label]) => (
                    <a key={href} href={href}>{label}</a>
                  ))}
                </div>
              </details>
              <a className="concept-side-menu__main" href="/vakansii">Вакансии</a>
              <a className="concept-side-menu__main" href="/novosti">Новости</a>
              <a className="concept-side-menu__main" href="#contacts">Контакты</a>
            </div>
          </details>

          <a className="concept-phone-float" href={phoneHref} aria-label="Позвонить в клинику">
            <span>☎</span>
          </a>

          {children}

          <footer className="concept-footer">
            <div className="concept-shell">
              <span>© 2026 {siteName}</span>
              <a href="/">Главная</a>
            </div>
          </footer>
        </div>
        <Script src="/concept-menu.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
