import { createSelector } from 'reselect';

const getState = (state: any) => state;

//  General getters
export const getStories = createSelector(getState, (state: any) => state.stories);
