import { createSlice, PayloadAction } from '@reduxjs/toolkit';



export interface userState {
    user_id: number;
    userName: string
}

const initialState: userState = {
    user_id: 0,
    userName: ''
};

const userSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        userInfo: (state, action: PayloadAction<userState>) => {
                state.user_id = action.payload.user_id
                state.userName = action.payload.userName
        
            
        }
    }
});

export const { userInfo } = userSlice.actions;
export default userSlice.reducer;