new VConsole()
// getUserMedia 被标准废除了，mediaDevices 正在取代中
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }
      return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
      });
  }
}

// 想要获取一个最接近 1280x720 的相机分辨率
var video = document.querySelector('video');

var v_width = video.clientWidth
var v_height = video.clientHeight
var constraints = { audio: false, video: { width: v_width, height: v_height } }; 
navigator.mediaDevices.getUserMedia(constraints)
.then(function(mediaStream) {
  video.srcObject = mediaStream;
  video.onloadedmetadata = function(e) {
    video.play();
  };
})
.catch(function(err) { console.log(err.name + ": " + err.message); }); // 总是在最后检查错误

// 视频截图
function captureImage(){
  var canvas = document.createElement("canvas");
    canvas.width = video.videoWidth * 0.8;
    canvas.height = video.videoHeight * 0.8;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
}

// 解析二维码
function getCode(objectUrl){
  qrcode.decode(objectUrl);
  qrcode.callback = function (imgMsg) {
    console.log(imgMsg);
  }
}

var timer = setInterval(function(){
  getCode(captureImage())
},1000)