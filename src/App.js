import './App.css';
import { useRef, useState } from 'react';
import logo from './imges/logo.png'
import vid1 from './videos/004d8cd8c5cc42b4be45c773533a3fdc.mp4'
import vid2 from './videos/67f764a902d84e1f86d830199902fa7e.mp4'
import vid3 from './videos/95d4a1ea91b44424b768ac5a6a430aba.mp4'
import VideoGridModal from './components/videoGrid';
import { BsBadgeHd, BsClipboardCheck } from "react-icons/bs";
function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };
  const handleImageUpload = (file) => {
    if (file) {
      const acceptedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml'];
      if (acceptedFormats.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Vui lòng chọn tệp PNG, JPEG, JPG, GIF hoặc SVG.');
      }
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const videoPaths = [
    { id: 1, path: vid1, title: 'Video 1' },
    { id: 2, path: vid2, title: 'Video 2' },
    { id: 3, path: vid3, title: 'Video 3' },
  ];
  const handleSearch = () => {
    setSearchResults(videoPaths);
  };
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };
  const handleCloseModal = () => {
    setSelectedVideo(null);
  };
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <img src={logo} alt='' className="logo-image" />
        </div>
        <div className='title'>
          Nhóm 11
        </div>
      </header>
      <div className="title-content">Hệ thống tìm kiếm các videos có nội dung giống nhất hoặc chứa nội dung của ảnh đầu vào</div>
      <div
        className="content"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div style={{ marginRight: 200, marginBottom: 400 }}>
          <h2><BsBadgeHd /> Cách tìm kiếm videos từ ảnh</h2>
          <p style={{ width: 300, marginLeft: 30, fontSize: 18, textAlign: 'center' }}>Kéo thả hoặc ấn "Chọn File" để tải file ảnh của bạn lên. Sau đó ấn "Tìm kiếm videos", hệ thống của chúng tôi sẽ tìm kiếm các videos có nội dung chứa hoặc gần giống nhất ảnh có trong CSDL và hiển thị ra kết quả.</p>
        </div>
        <div className="container" >

          {selectedImage ? (
            <div onClick={handleImageClick}>
              <img
                src={selectedImage}
                alt="Mô tả ảnh"
                className="custom-image"
              />
              <input
                type="file"
                hidden
                name=""
                id=""
                ref={fileInputRef}
                onChange={handleFileInputChange}
              />
            </div>

          ) : (
            <>
              <header className="custom-header">Kéo và thả để tải file Ảnh lên</header>
              <span className="custom-span">Hoặc</span>
              <button
                className="custom-label"
                onClick={handleImageClick}
              >
                Chọn file
              </button>
              <input
                type="file"
                hidden
                name=""
                id=""
                ref={fileInputRef}
                onChange={handleFileInputChange}
              />
            </>
          )}

        </div>
        <div>
          {selectedImage && (
            <div className="centered-content">
              <button className="search-button" onClick={handleSearch}>Tìm kiếm Videos</button>
            </div>
          )}
          {searchResults.length > 0 ? (
            <div className="search-results">
              <h2>Kết quả tìm kiếm</h2>
              <div className="video-grid">
                {searchResults.map((video) => (
                  <div key={video.id} className="video-item" onClick={() => handleVideoClick(video)}>
                    <video src={video.path} type="video/mp4" controls width="300" height="180" />
                    <p>{video.title}</p>
                  </div>
                ))}
                {selectedVideo && (
                  <VideoGridModal video={selectedVideo} onClose={handleCloseModal} />
                )}
              </div>
            </div>
          ) : (
            <div className="search-results">
              <p className="no-search-results">Không có video nào được tìm thấy có kết quả tương đồng với ảnh của bạn<br />Vui lòng thử với file ảnh khác<br />Xin cảm ơn!</p>

            </div>
          )}
        </div>
        <div style={{ marginLeft: 200, marginBottom: 450 }}>
          <h2><BsClipboardCheck /> Điều kiện file ảnh đầu vào</h2>
          <p style={{ width: 300, marginLeft: 30, fontSize: 18, textAlign: 'center' }}>Hệ thống chấp nhận các file ảnh đầu vào có đuôi /.png /.jpeg /.jpg /.git /.svg+xml</p>
        </div>
      </div>
    </div >
  );
}

export default App;
