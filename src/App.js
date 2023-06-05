import './App.css';
import { useEffect, useReducer, useRef, useState } from 'react';
import logo from './imges/logo.png'
import VideoGridModal from './components/videoGrid';
import { BsBadgeHd, BsClipboardCheck } from "react-icons/bs";
import { AiOutlineFileImage } from "react-icons/ai";
import { LuImagePlus } from "react-icons/lu";
import { type } from '@testing-library/user-event/dist/type';
import axios from 'axios';
export const SET_FILE_UPLOAD = "SET_FILE_UPLOAD"
export const REQUEST_SEARCH_VIDEO = "REQUEST_SEARCH_VIDEO"
export const REQUEST_SEARCH_VIDEO_SUCCESS = "REQUEST_SEARCH_VIDEO_SUCCESS"
export const REQUEST_SEARCH_VIDEO_FAILURE = "REQUEST_SEARCH_VIDEO_FAILURE"
const reduce = (state, action) => {
  switch (action.type) {
    case SET_FILE_UPLOAD:
      return {
        ...state, file: action.payload,
      }
    case REQUEST_SEARCH_VIDEO:
      return {
        ...state, loading: true,
      }
    case REQUEST_SEARCH_VIDEO_SUCCESS:
      return {
        ...state, dataVideo: action.payload.data, loading: false,
      }
    case REQUEST_SEARCH_VIDEO_FAILURE:
      return {
        ...state, loading: false, error: action.payload,
      }
    default:
      return {
        ...state
      }
  }
}
function App() {
  const [{ loading, dataVideo, error, file }, dispatch] = useReducer(reduce, { loading: false, dataVideo: null, error: "", file: null })
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchClicked, setSearchClicked] = useState(false);
  const fileInputRef = useRef(null);

  const handlePostDataVideo = (file) => { }


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
    dispatch({ type: SET_FILE_UPLOAD, payload: file });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  // const videoPaths = [
  //   { id: 1, path: vid1, time: 10.0 },
  //   { id: 2, path: vid2, time: 6.0 },
  //   { id: 3, path: vid3, time: 1.0 },
  // ];
  const handleSearch = async () => {
    dispatch({ type: REQUEST_SEARCH_VIDEO })
    console.log(REQUEST_SEARCH_VIDEO)
    try {
      const formData = new FormData();
      formData.append("file", file)
      const { data } = await axios.post('http://localhost:3001/search', formData)
      dispatch({ type: REQUEST_SEARCH_VIDEO_SUCCESS, payload: data })
      console.log(REQUEST_SEARCH_VIDEO_SUCCESS)
    } catch (error) {
      if (error.response) {
        dispatch({ type: REQUEST_SEARCH_VIDEO_FAILURE, payload: error.response.data.message })
        console.log(error.response.data.message)
      }
      else {
        dispatch({ type: REQUEST_SEARCH_VIDEO_FAILURE, payload: error.message })
        console.log(error.message)
      }
      console.log(REQUEST_SEARCH_VIDEO_FAILURE)
    }

    setSearchClicked(true);
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
              <AiOutlineFileImage style={{ fontSize: 50, opacity: 0.7, strokeWidth: 0.1 }} />
              <div className="custom-header">Kéo và thả để tải file ảnh lên</div>
              <span className="custom-span">Hoặc</span>
              <button
                className="custom-label"
                onClick={handleImageClick}
              >
                <LuImagePlus /> Chọn file ảnh
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
          {searchClicked && (
            <div>
              {searchResults.length > 0 ? (
                <div className="search-results">
                  <h2>Kết quả tìm kiếm</h2>
                  <div className="video-grid">
                    {dataVideo && [dataVideo].map((video, index) => (
                      <div key={index} className="video-item" onClick={() => handleVideoClick(video)}>
                        <video src={video.path} type="video/mp4" controls onLoadedMetadata={(e) => e.target.currentTime = video.time} width="300" height="180" />
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
