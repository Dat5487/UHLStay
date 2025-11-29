import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {RootState} from "../store.ts";

type PinnableType = 'motels' | 'items' | 'posts';

export interface UserActionsState {
    pinned: {
        motels: string[];
        items: string[];
        posts: string[];
    };
}

const initialState: UserActionsState = {
    pinned: {
        motels: [],
        items: [],
        posts: [],
    },
};

interface TogglePinPayload {
    type: PinnableType;
    id: number | string;
}

const userActionsSlice = createSlice({
    name: 'userActions',
    initialState,
    reducers: {
        togglePin: (state, action: PayloadAction<TogglePinPayload>) => {
            const { type, id } = action.payload;
            const idList = state.pinned[type] as (number | string)[];
            const index = idList.indexOf(id);

            if (index >= 0) {
                idList.splice(index, 1);
            } else {
                idList.push(id);
            }
        },
    },
});
export const { togglePin } = userActionsSlice.actions;
export const selectPinnedItems = (state: RootState) => state.userActions.pinned;
export const userActionsReducer = userActionsSlice.reducer;