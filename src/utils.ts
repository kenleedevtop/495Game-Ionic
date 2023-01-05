import { JourneyStore } from "./store";
import axios from 'axios';

const API_URL = "http://localhost:8080/api";

export const capitalizeWords = (string: string) => {
    return string.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
};

export const getStoriesFromDB = async () => {
    const response = await axios.get(`${API_URL}/stories`)
    JourneyStore.update((s: any) => { s.stories = response.data });
    return response.data;
}
