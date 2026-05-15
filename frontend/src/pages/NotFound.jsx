import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-code">404</div>
        <h1>Sayfa Bulunamadı</h1>
        <p>
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <Link to="/" className="btn btn-primary">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
