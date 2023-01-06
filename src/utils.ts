import { AppStore } from "./store";
import axios from 'axios';

const API_URL = "http://localhost:8080/api";

export const capitalizeWords = (string: string) => {
    return string.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
};

export const joinLobby = async () => {
    const response = await axios.get(`${API_URL}/stories`)
    AppStore.update((s: any) => { s.stories = response.data });
    return response.data;
}

export const makeRandom = () => {
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    const lengthOfCode = 7;
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}