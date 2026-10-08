export function MapSection() {
  return (
    <section className="concept-section concept-map-section" id="contacts" aria-label="Карта проезда">
      <div className="concept-shell">
        <div className="concept-section-head">
          <h2>Как нас найти</h2>
          <p>г. Раменское, ул. Красноармейская, д. 13</p>
        </div>
        <div className="concept-map-card">
          <iframe
            src="https://yandex.ru/map-widget/v1/?ll=38.233634%2C55.572556&z=18&pt=38.233634%2C55.572556%2Cpm2rdm"
            title="Ветеринар на связи на карте"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

export function FinalCta({ phoneHref = 'tel:+74951444803' }) {
  return (
    <section className="concept-section concept-section--royal">
      <div className="concept-shell concept-final">
        <div>
          <h2>Нужна помощь питомцу?</h2>
          <p>Позвоните в клинику, опишите ситуацию администратору и уточните ближайшее удобное время приема.</p>
        </div>
        <a className="concept-button concept-button--primary" href={phoneHref}>
          Позвонить
        </a>
      </div>
    </section>
  );
}

// Content-page shell: hero (kicker, breadcrumbs, h1) + content card + map + CTA.
export function ContentPage({ kicker, breadcrumbLabel, h1, bodyHtml, homeLabel = 'Главная' }) {
  return (
    <main>
      <section className="concept-page-hero">
        <div className="concept-shell">
          {kicker ? <p className="concept-kicker">{kicker}</p> : null}
          <nav className="concept-breadcrumbs" aria-label="Хлебные крошки">
            <a href="/">{homeLabel}</a>
            <span className="concept-breadcrumbs__sep">/</span>
            <span className="concept-breadcrumbs__current" aria-current="page">
              {breadcrumbLabel || h1}
            </span>
          </nav>
          {h1 ? <h1>{h1}</h1> : null}
        </div>
      </section>

      <section className="concept-section">
        <div className="concept-shell">
          <div className="concept-content-card">
            <div className="concept-content" dangerouslySetInnerHTML={{ __html: bodyHtml || '' }} />
          </div>
        </div>
      </section>

      <MapSection />
      <FinalCta />
    </main>
  );
}
