class Music{
    constructor(title , singer , img , file){
        this.title = title;
        this.singer = singer;
        this.img = img;
        this.file = file;
    }
    getName() {
        return this.title + '-' + this.singer
    }
}

const musicList = [
    new Music("Blow Your Mind ","Dua Lipa","1.jpg","1.mp3"),
    new Music("Him & I ","G-Eazy & Halsey","2.jpg","2.mp3"),
    new Music("I'M a Peaky Blinder ","Otnicka, Duke Luke","3.jpg","3.mp3"),
    new Music("Para ","UZİ","4.jpg","4.mp3"),
]

