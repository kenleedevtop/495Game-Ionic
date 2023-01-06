import { createSelector } from 'reselect';

const getState = (state: any) => state;

//  General getters
export const getRoomList = createSelector(getState, (state: any) => state.roomList);
export const getRoom = createSelector(getState, (state: any) => state.room);
export const getNickname = createSelector(getState, (state: any) => state.nickname);
