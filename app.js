//Audio eventleri ile ilgili detaylar için html audio events yazarak w3school üzerinden bakılabilir.
const container = document.querySelector('.container');
const image = document.querySelector('#music-image');
const title = document.querySelector('#music-details .title');
const singer = document.querySelector('#music-details .singer');
const play = document.querySelector('#controls #play');
const prev = document.querySelector('#controls #prev');
const next = document.querySelector('#controls #next');
const duration = document.querySelector('#duration');
const currentTime = document.querySelector('#current-time');
const progressBar = document.querySelector('#progress-bar');
const volume = document.querySelector('#volume');
const volumeBar = document.querySelector('#volume-bar');
const ul = document.querySelector('ul');



const player = new MusicPlayer(musicList);

let music = player.getMusic();
// console.log(music.getName());

window.addEventListener("load", () => {
    let music = player.getMusic();
    displayMusic(music);
    displayMusicList(player.musicList);
    isPlayingNow();
});

function displayMusic(music) {
    title.innerText = music.getName();
    singer.innerText = music.singer;
    singer.classList.add("fw-bold");
    singer.classList.add("fs-5");
    image.src = "img/" + music.img;
    audio.src = "mp3/" + music.file;
}

play.addEventListener("click", () => {
    const isMusicPlay = container.classList.contains("playing"); // boolean yani true false değer döndürecek.
    isMusicPlay ? pausemusic() : playMusic(); // ismusicplay içindeki değer true ise pausemusic yani müziği durdurur. false ise playmusic fonsksiyonuna giderek başlatır.
});

prev.addEventListener("click", () => {
    prevMusic();
});
next.addEventListener("click", () => {
    nextMusic();
});

const prevMusic = () => {
    player.prev();
    let music = player.getMusic();
    displayMusic(music);
    playMusic(music);
    isPlayingNow();
}

const nextMusic = () => {
    player.next();
    let music = player.getMusic();
    displayMusic(music);
    playMusic(music);
    isPlayingNow();
}

const pausemusic = () => {
    container.classList.remove("playing");
    play.querySelector("i").classList = "fa-solid fa-play"
    audio.pause();
};

const playMusic = () => {
    container.classList.add("playing");
    play.querySelector("i").classList = "fa-solid fa-pause"
    audio.play();
};

const calculateTime = (toplamSaniye) => {
    const dakika = Math.floor(toplamSaniye / 60);
    const saniye = Math.floor(toplamSaniye % 60);
    const guncellenenSaniye = saniye < 10 ? `0${saniye}` : `${saniye}`; // 0${saniye} misal %60'tan kalan 9 saniye ise 09 saniye şeklinde yazması için başına 0 ekledik.
    const sonuc = `${dakika}:${guncellenenSaniye}`;
    return sonuc;
}
audio.addEventListener("loadedmetadata", () => {
    duration.textContent = calculateTime(audio.duration);
    progressBar.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.textContent = calculateTime(progressBar.value);
});

progressBar.addEventListener("input", () => {
    // console.log("ff"); // progress bar'a her tıklama anında yazdırıyor.
    currentTime.textContent = calculateTime(progressBar.value);
    audio.currentTime = progressBar.value;
});

//Ses butonun açılıp kapanması ve ikon değişimi.
let muteState = "unmuted";

volumeBar.addEventListener("input", (e) => { // input referansı yani barın referansının nerede olduğunu görmek için fonskiyon içine bir parametre vermeliyiz.
    // console.log(e.target.value); progress-bar'dan 0-100 arası değer alıyoruz fakat html tanımlamasında audionun alabileceği değer 0-1 arası olarak tanımlandığı için aşağıdaki 100'e bölme işlemini gerçekleştirdik.
    const value = e.target.value;
    audio.volume = value / 100; // 0-1 arası değer gerekli.
    if (value == 0) {
        audio.muted = true;
        muteState = "muted";
        volume.classList = "fa-solid fa-volume-xmark";
    } else {
        audio.muted = false;
        muteState = "unmuted";
        volume.classList = "fa-solid fa-volume-high";
    }
});

volume.addEventListener("click", () => {
    // console.log("ff");
    if (muteState == "unmuted") {
        audio.muted = true;
        muteState = "muted";
        volume.classList = "fa-solid fa-volume-xmark";
        volumeBar.value = 0;
    } else {
        audio.muted = false;
        muteState = "unmuted";
        volume.classList = "fa-solid fa-volume-high";
        volumeBar.value = 50;
    }
});

const displayMusicList = (list) => {
    for (let i = 0; i < list.length; i++) {
        let liTag =
            `
            <li li-index = "${i}" onclick = "selectedMusic(this)"class="user-select-none list-group-item d-flex justify-content-between align-items-center">
                <span>${list[i].getName()}</span>
                <span id = "music-${i}" class="badge bg-primary rounded-pill"></span>
                <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
            </li>
        `;
        // onclick = "selectedMusic(this)" tıkladığımızda direk li elemanını verir.Müziği seçebilmek için ise index numarasına ihtiyacımız var.
        // li-index = "${i}" li-index = "0"
        // li-index = "${i}" li-index = "1"
        // li-index = "${i}" li-index = "2" şeklinde çıktı verir.Aşağıda açılan slider'da müziğe tıkladığımızda indexe göre şeçim yapabilmek için yazdık.
        
        
        ul.insertAdjacentHTML("beforeend", liTag);
        let liAudioDuration = ul.querySelector(`#music-${i}`);
        let liAudioTag = ul.querySelector(`.music-${i}`);

        liAudioTag.addEventListener("loadeddata", () => {
            liAudioDuration.innerText = calculateTime(liAudioTag.duration);
            // console.log(liAudioTag.duration);//325.694694
            //212.218776
            //191.212113
        });

    }
}
const selectedMusic = (li) =>{
    // console.log(li);
    const index = li.getAttribute('li-index');
    // console.log(index); //0,1,2 şeklinde çıktı alırız.
    player.index = index;
    displayMusic(player.getMusic());
    playMusic();
    isPlayingNow();
}

const isPlayingNow  = () => {
    for(let li of ul.querySelectorAll("li")){
        if(li.classList.contains("playing")){ // true false döndürecek
            li.classList.remove("playing");
        }
        if(li.getAttribute("li-index") == player.index){
            li.classList.add("playing");
        }
    }
}

audio.addEventListener("ended",() =>{
    nextMusic();
});
// player.next();
// music = player.getMusic();
// console.log(music.getName());
// player.previous();
// music = player.getMusic();
// console.log(music.getName());