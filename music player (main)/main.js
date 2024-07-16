const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const player = $('.player');
const playBtn = $(' .btn-toggle-play');
const progress = $('#progress'); 
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random ')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom : false,
  isRepeat: false,
  songs: [
    {
      singer: "Travis Scott",
      name: "My Eyes",
      path: "./song/Travis Scott - MY EYES (Official Audio).mp3",
      img: 'https://i1.sndcdn.com/artworks-6jyeyJ6ROmM5jsUc-NonbpQ-t500x500.jpg'
    },
    {
      singer: "Sơn Tùng MTP",
      name: "Đừng làm trái tim anh đau",
      path: "./song/SƠN TÙNG M-TP - ĐỪNG LÀM TRÁI TIM ANH ĐAU - OFFICIAL MUSIC VIDEO.mp3",
      img: 'https://upload.wikimedia.org/wikipedia/vi/thumb/e/e5/S%C6%A1n_T%C3%B9ng_M-TP_-_%C4%90%E1%BB%ABng_l%C3%A0m_tr%C3%A1i_tim_anh_%C4%91au.png/330px-S%C6%A1n_T%C3%B9ng_M-TP_-_%C4%90%E1%BB%ABng_l%C3%A0m_tr%C3%A1i_tim_anh_%C4%91au.png'
    },
    {
      singer: "Mono",
      name: "Waiting For You",
      path: "./song/MONO - Waiting For You (Album 22 - Track No.10).mp3",
      img:' https://bazaarvietnam.vn/wp-content/uploads/2023/01/mono-2.jpg'
    }
  ],

  render: function() {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${index === this.currentIndex ? 'active':''}" data-index = "${index}">
          <div class="thumb" style="background-image: url('${song.img}')"></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
      `;
    });
    $('.playlist').innerHTML = htmls.join('');
  },

  defineProperties: function() {
    Object.defineProperty(this, 'currentSong', {
      get: function() {
        return this.songs[this.currentIndex];
      }
    });
  },

  handleEvents: function() {
    const _this = this;
    // Tạo animation cho cdThumb và lưu vào biến cdThumbAnimate
    const cdThumbAnimate = cdThumb.animate([
      { transform: 'rotate(360deg)' }
    ], {
      duration: 10000,
      iterations: Infinity
    });
    cdThumbAnimate.pause();
    // Xử lý phóng to thu nhỏ cd
    const cdWidth = cd.offsetWidth; 
    document.onscroll = function() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - scrollTop;
      cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
      cd.style.opacity = newWidth / cdWidth;
    },


    // Xử lý khi click play
    playBtn.onclick = function() {
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play(); 
      }
    }

    // Khi song được play
    audio.onplay = function() {
      _this.isPlaying = true
      player.classList.add('playing')
      cdThumbAnimate.play()
    };

    // Khi song bị pause
    audio.onpause = function() {
      _this.isPlaying = false
      player.classList.remove('playing')
      cdThumbAnimate.pause();
    };

    //khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function(){
      if (audio.duration){
        const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
        progress.value = progressPercent;
      }
    }

    //xử lý tua xong
    progress.onchange  = function(e){
      const seekTime = audio.duration / 100 *e.target.value 
      audio.currentTime = seekTime
    }
      
    //khi next song 
    nextBtn.onclick = function(){
      if (_this.isRandom) {
        _this.playRandomSong(); 
      } else {
        _this.nextSong();
      }
      _this.render();
      _this.scrollToActiveSong();
      audio.play();
    }

    // Khi prev song 
    prevBtn.onclick = function(){
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      _this.scrollToActiveSong();
      _this.render();
      audio.play();
    }

    randomBtn.onclick = function(){
      _this.isRandom = !_this.isRandom
      randomBtn.classList.toggle('active', _this.isRandom)

    }

    repeatBtn.onclick = function(e){
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle('active', _this.isRepeat)
    }

    //xử lý next sau khi audio ended
    audio.onended =function(){
      if (_this.isRepeat){
        audio.play();
      }else{
        nextBtn.click();
      }
    }

    playlist.onclick = function(e){
      const songNode = e.target.closest('.song:not(.active)')
      //xử lý khi click vào song 
      if ( songNode || e.target.closest('.option') ){
        
        if(songNode){
            _this.currentIndex = Number(songNode.dataset.index);
            _this.loadCurrentSong() 
            _this.render();
            audio.play();
        }
        //xử lý khi click vào option
        if (e.target.closest('.option')){

        }
      }
    }
  },

  scrollToActiveSong: function(){
    if (_this.currentIndex !=0){
      setTimeout(()=>{
        $('.song .active').scrollIntoView({
          behavior : 'smooth',
          block: 'nearest'
        })
      }, 50)
    }else{
      setTimeout(()=>{
        $('.song .active').scrollIntoView({
          behavior : 'smooth',
          block: 'center'
        })
      }, 50)
    }
  },


  loadCurrentSong: function() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function(){
    this.currentIndex++;
    if (this.currentIndex>=this.songs.length){
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function(){
    this.currentIndex--;
    if (this.currentIndex<0){
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function(){
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    // Cập nhật this.currentIndex sau khi vòng lặp kết thúc
    this.currentIndex = newIndex; 
    this.loadCurrentSong(); // Gọi hàm loadCurrentSong
    audio.play();
  },

  start: function() {
    // Định nghĩa các thuộc tính cho object app
    this.defineProperties();

    // Lắng nghe / xử lý các sự kiện (DOM events)
    this.handleEvents();

    // Render playlist
    this.render();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();
  }
};

// Start the app
app.start();