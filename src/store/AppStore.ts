import { Store } from "pullstate";

const AppStore = new Store({
    nickname: "",
    room: "",
    roomList: [],
});

export default AppStore;