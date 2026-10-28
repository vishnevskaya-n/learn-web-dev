export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <div className="logo-circle"><span className="logo-b">B</span></div>
        <span className="logo-text">Barbie style</span>
      </div>
      <nav className="nav">
        <a href="#">Услуги</a>
        <a href="#">Галерея</a>
        <a href="#">Команда</a>
        <a href="#">Отзывы</a>
        <a href="#">Контакты</a>
      </nav>
    </header>
  );
}