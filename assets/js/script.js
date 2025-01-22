let currentSong = new Audio();
let songs;
let currentArtist = "talha_anjum";
let currentFolder;
let previousLi = null;

function secsToMinSecs(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const mins = Math.floor(seconds / 60);
  const remainingSecs = Math.floor(seconds % 60);

  const formattedMins = String(mins).padStart(2, '0');
  const formattedSecs = String(remainingSecs).padStart(2, '0');

  return `${formattedMins}:${formattedSecs}`;
}

async function getAlbums() {
  let artistList = await fetch(`https://spotifywebmusicplayer.netlify.app/assets/songs/`);
  let response = await artistList.text();
  let div = document.createElement('div');
  div.innerHTML = response;
  let artistAnchor = div.getElementsByTagName("a");
  let albumContainer = document.querySelector(".pa_inner");
  let artistArray = Array.from(artistAnchor);
  for (let el = 0; el < artistArray.length; el++) {
    const e = artistArray[el];
    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-1)[0];
      let a = await fetch(`https://spotifywebmusicplayer.netlify.app/assets/songs/${folder}/info.json`);
      let response = await a.json();
      albumContainer.innerHTML = albumContainer.innerHTML + `
      <div>
        <div class="artist-item card" data-artist="${folder}" >
          <div class="ai-inner">
            <div class="ai-img">
              <img src="assets/songs/${folder}/artist.jpg" alt="">
              <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                  color="#000000" fill="#000">
                  <path
                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                    stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
              </div>
            </div>
            <div class="ai-info">
              <h5 class="ai-title" title="${response.title}">${response.title}</h5>
              <p class="ai-text">${response.description}</p>
            </div>
          </div>
        </div>
      </div>
      `;
    }
  }
  $(".pa_inner").slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    dots: false,
    nav: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
          slidesToShow: 4
        }
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          slidesToShow: 4
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          slidesToShow: 3
        }
      }
    ]
  });

  Array.from(document.getElementsByClassName("artist-item")).forEach(e => {
    e.addEventListener("click", async item => {
      // document.querySelectorAll(".artist-item").forEach((el) => el.classList.remove("active"));
      // item.classList.add("active");
      await displayAlbums(e.dataset.artist);
    })
  });
}
async function getSongs(folder) {
  currentFolder = folder;
  let songList = await fetch(`https://spotifywebmusicplayer.netlify.app/assets/songs/${currentArtist}/albums/${folder}/`);
  let response = await songList.text();
  let div = document.createElement('div');
  div.innerHTML = response;
  let songItems = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < songItems.length; i++) {
    const element = songItems[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/assets/songs/${currentArtist}/albums/${folder}/`)[1]);
    }
  }

  let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  // currentAlbum.innerHTML = "- " + cresponse.title;
  for (const song of songs) {
    songUl.innerHTML = songUl.innerHTML + `
      <li>
        <img width="20" src="assets/images/svg/playlist.svg" alt="">
        <div class="info">
          <div class="songName">${song.replaceAll("%20", " ").replace(".mp3", "")}</div>
          <div class="artist">Harry</div>
        </div>
        <div class="playnow">
          <img src="assets/images/svg/play2.svg" alt="">
        </div>
      </li>
    `;
  }
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      if (previousLi) {
        // previousLi.classList.remove("active");
        // previousLi.querySelector(".playnow").getElementsByTagName("img")[0].src = "assets/images/svg/play2.svg";
        // previousLi.querySelector(".playnow").getElementsByTagName("img")[0].style.filter = "invert(0.6)";
      }
      e.classList.add("active");
      e.querySelector(".playnow").getElementsByTagName("img")[0].src = "assets/images/pause.gif";
      e.querySelector(".playnow").getElementsByTagName("img")[0].style.filter = "invert(1)";
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim() + ".mp3");
      previousLi = e;
    })
  });
  previousLi = document.querySelector(".songList").getElementsByTagName("li")[0];
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `assets/songs/${currentArtist}/albums/${currentFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "assets/images/svg/pause.svg";
    previousLi.classList.remove("active");
    previousLi.querySelector(".playnow").getElementsByTagName("img")[0].src = "assets/images/svg/play2.svg";
    previousLi.querySelector(".playnow").getElementsByTagName("img")[0].style.filter = "invert(0.6)";
    if (play.src.endsWith("pause.gif")) {
      play.style.filter = "none";
    }
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums(artist) {
  currentArtist = artist;
  let as = await fetch(`https://spotifywebmusicplayer.netlify.app/assets/songs/${artist}/albums/`);
  let albumresponse = await as.text();
  let album_div = document.createElement("div");
  album_div.innerHTML = albumresponse;
  let anchors = album_div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  cardContainer.innerHTML = "";
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes(`/albums/`)) {
      let albumfolder = e.href.split('/').pop();
      let a = await fetch(`https://spotifywebmusicplayer.netlify.app/assets/songs/${artist}/albums/${albumfolder}/info.json`);
      let response_a = await a.json();
      cardContainer.innerHTML = cardContainer.innerHTML + `
        <div class="col-12 col-sm-4 col-md-4 col-lg-3 mb-3 px-0">
          <div data-folder="${albumfolder}" class="card album-card">
            <div class="card-img">
              <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000"
                  fill="#000">
                  <path
                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                    stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
              </div>
              <img src="/assets/songs/${artist}/albums/${albumfolder}/cover.jpeg" alt="" class="card-img-top">
            </div>
            <div class="card-body">
              <h3 class="card-title">${response_a.title}</h3>
              <p class="card-text">${response_a.description}</p>
            </div>
          </div>
        </div>
      `;
    }
  };

  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getSongs(item.currentTarget.dataset.folder);
      playMusic(songs[0]);
      previousLi.classList.add("active");
      previousLi.querySelector(".playnow").getElementsByTagName("img")[0].src = "assets/images/pause.gif";
      previousLi.querySelector(".playnow").getElementsByTagName("img")[0].style.filter = "invert(1)";
    })
  });
};

async function main() {

  toggleSwitch.addEventListener("change", () => {
    if (toggleSwitch.checked) {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
    }
  });

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      document.querySelector(".sidebar").classList.add("show");
    } else {
      document.querySelector(".sidebar").classList.remove("show");
    }
  })

  document.querySelector("aside").addEventListener("click", () => {
    if (sidebar.classList.contains("show")) {
      sidebar.classList.remove("show");
      checkbox.checked = false;
    }
  })

  getAlbums();

  await getSongs("1");
  playMusic(songs[0], true);

  displayAlbums(currentArtist);

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "assets/images/svg/pause.svg";
      previousLi.classList.add("active");
      previousLi.querySelector(".playnow").getElementsByTagName("img")[0].src = "assets/images/pause.gif";
      previousLi.querySelector(".playnow").getElementsByTagName("img")[0].style.filter = "invert(1)";
      if (document.body.classList.contains("light-theme")) {
        play.style.filter = "none";
      }
    } else {
      currentSong.pause();
      play.src = "assets/images/svg/play.svg";
      previousLi.querySelector(".playnow").getElementsByTagName("img")[0].src = "assets/images/svg/play2.svg";
      previousLi.querySelector(".playnow").getElementsByTagName("img")[0].style.filter = "invert(0.6)";
      if (document.body.classList.contains("light-theme")) {
        play.style.filter = "invert(1)";
      }
    }
  })

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secsToMinSecs(currentSong.currentTime)} / ${secsToMinSecs(currentSong.duration)}`;
    document.querySelector(".circle").style.left = ((currentSong.currentTime / currentSong.duration) * 100) + "%";
    if (currentSong.currentTime == currentSong.duration) {
      play.src = "assets/images/svg/play.svg";
      previousLi.querySelector(".playnow").getElementsByTagName("img")[0].src = "assets/images/svg/play2.svg";
      previousLi.querySelector(".playnow").getElementsByTagName("img")[0].style.filter = "invert(0.6)";
    }
  })

  document.querySelector(".seekbar").addEventListener("click", e => {
    let cirPercent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = cirPercent + "%";
    currentSong.currentTime = ((currentSong.duration) * cirPercent) / 100;
  })

  prev.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index - 1) >= 0) {
      currentSong.pause();
      playMusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1]);
    } else if ((index + 1) == songs.length) {
      currentSong.play();
    }
  });

  const defaultVolume = 1;
  const defaultRangeValue = 100;

  // Function to update the volume icon based on the volume level
  function updateVolumeIcon(volume) {
    volImg.innerHTML = '';

    if (volume >= 0.6) {
      volImg.innerHTML = `
      <path d="M14 14.8135V9.18646C14 6.04126 14 4.46866 13.0747 4.0773C12.1494 3.68593 11.0603 4.79793 8.88232 7.02192C7.75439 8.17365 7.11085 8.42869 5.50604 8.42869C4.10257 8.42869 3.40084 8.42869 2.89675 8.77262C1.85035 9.48655 2.00852 10.882 2.00852 12C2.00852 13.118 1.85035 14.5134 2.89675 15.2274C3.40084 15.5713 4.10257 15.5713 5.50604 15.5713C7.11085 15.5713 7.75439 15.8264 8.88232 16.9781C11.0603 19.2021 12.1494 20.3141 13.0747 19.9227C14 19.5313 14 17.9587 14 14.8135Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M17 9C17.6254 9.81968 18 10.8634 18 12C18 13.1366 17.6254 14.1803 17 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20 7C21.2508 8.36613 22 10.1057 22 12C22 13.8943 21.2508 15.6339 20 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    `;
    } else if (volume >= 0.2) {
      volImg.innerHTML = `
      <path d="M19 9C19.6254 9.81968 20 10.8634 20 12C20 13.1366 19.6254 14.1803 19 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 14.8135V9.18646C16 6.04126 16 4.46866 15.0747 4.0773C14.1494 3.68593 13.0604 4.79793 10.8823 7.02192C9.7544 8.17365 9.11086 8.42869 7.50605 8.42869C6.10259 8.42869 5.40086 8.42869 4.89677 8.77262C3.85036 9.48655 4.00854 10.882 4.00854 12C4.00854 13.118 3.85036 14.5134 4.89677 15.2274C5.40086 15.5713 6.10259 15.5713 7.50605 15.5713C9.11086 15.5713 9.7544 15.8264 10.8823 16.9781C13.0604 19.2021 14.1494 20.3141 15.0747 19.9227C16 19.5313 16 17.9587 16 14.8135Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    `;
    } else if (volume > 0) {
      volImg.innerHTML = `
      <path d="M18 14.8135V9.18646C18 6.04126 18 4.46866 17.074 4.0773C16.1481 3.68593 15.0583 4.79793 12.8787 7.02192C11.7499 8.17365 11.1059 8.42869 9.5 8.42869C8.3879 8.42869 7.02749 8.28131 6.33706 9.33566C6 9.85038 6 10.5669 6 12C6 13.4331 6 14.1496 6.33706 14.6643C7.02749 15.7187 8.3879 15.5713 9.5 15.5713C11.106 15.5713 11.7499 15.8264 12.8787 16.9781C15.0583 19.2021 16.1481 20.3141 17.074 19.9227C18 19.5313 18 17.9587 18 14.8135Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    `;
    } else {
      volImg.innerHTML = `
      <path d="M14 14.8135V9.18646C14 6.04126 14 4.46866 13.0747 4.0773C12.1494 3.68593 11.0603 4.79793 8.88232 7.02192C7.75439 8.17365 7.11085 8.42869 5.50604 8.42869C4.10257 8.42869 3.40084 8.42869 2.89675 8.77262C1.85035 9.48655 2.00852 10.882 2.00852 12C2.00852 13.118 1.85035 14.5134 2.89675 15.2274C3.40084 15.5713 4.10257 15.5713 5.50604 15.5713C7.11085 15.5713 7.75439 15.8264 8.88232 16.9781C11.0603 19.2021 12.1494 20.3141 13.0747 19.9227C14 19.5313 14 17.9587 14 14.8135Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M18 10L22 14M18 14L22 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    `;
    }
  }

  let savedVolume = parseFloat(localStorage.getItem('volume')) || defaultVolume;
  let lastVolume = savedVolume;

  currentSong.volume = savedVolume;
  volRange.value = savedVolume * 100;
  updateVolumeIcon(savedVolume);

  volRange.addEventListener('change', (e) => {
    let newVolume = parseInt(e.target.value) / 100;
    currentSong.volume = newVolume;
    localStorage.setItem('volume', newVolume);
    updateVolumeIcon(newVolume);
    if (newVolume > 0) {
      lastVolume = newVolume;
    }
  });

  volImg.addEventListener('click', () => {
    if (currentSong.volume > 0) {
      lastVolume = currentSong.volume;
      currentSong.volume = 0;
      volRange.value = 0;
      localStorage.setItem('volume', 0);
      volImg.innerHTML = `
      <path d="M14 14.8135V9.18646C14 6.04126 14 4.46866 13.0747 4.0773C12.1494 3.68593 11.0603 4.79793 8.88232 7.02192C7.75439 8.17365 7.11085 8.42869 5.50604 8.42869C4.10257 8.42869 3.40084 8.42869 2.89675 8.77262C1.85035 9.48655 2.00852 10.882 2.00852 12C2.00852 13.118 1.85035 14.5134 2.89675 15.2274C3.40084 15.5713 4.10257 15.5713 5.50604 15.5713C7.11085 15.5713 7.75439 15.8264 8.88232 16.9781C11.0603 19.2021 12.1494 20.3141 13.0747 19.9227C14 19.5313 14 17.9587 14 14.8135Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M18 10L22 14M18 14L22 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    `;
    } else {
      currentSong.volume = lastVolume;
      volRange.value = lastVolume * 100;
      localStorage.setItem('volume', lastVolume);
      updateVolumeIcon(lastVolume);
    }
  });
};
main();
