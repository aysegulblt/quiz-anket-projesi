function Loading({ message = "Yükleniyor..." }) {
  return (
    <div className="loading-box">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export default Loading;
