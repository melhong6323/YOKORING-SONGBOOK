const firebaseConfig = {
    apiKey: "AIzaSyDDSJWWYCzwmM8DSIYI4w3vGPKSshpFhGk",
    authDomain: "yokoring-songbook.firebaseapp.com",
    databaseURL: "https://yokoring-songbook-default-rtdb.firebaseio.com",
    projectId: "yokoring-songbook"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const SHEET_ID = '1bSs04gJ8HyVil5PM0TBAm-4c_BeAqbU7ENMZ2AQcUVI';
const SHEET_NAMES = ['사용설명서','K-POP','POP','J-POP','숙제곡','신곡'];

let currentSongs = [];
let currentArtist = '전체';
let lyricsList = [];
