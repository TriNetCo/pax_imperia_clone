import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import usersApi from './usersAPI';


export const fetchAll = createAsyncThunk(
    'users/fetchAll',   // This is our action name
    async(thunkAPI) => {  // This is how we magically get fetchAll.pending/ fulfilled/ rejected to work
        const response = await usersApi.fetchAllUsers();
        return response;  // this is the state returned, making action.meta.requestId available to the reducers below...
    }
);

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async(userId, thunkAPI) => {
        const response = await usersApi.deleteUser(userId);
        return response;
    }
);

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        loading: 'idle',
        currentRequestId: undefined,
        users: []
    },
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {},
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk (above) or in other slices.
    extraReducers: {
        [fetchAll.pending]: (state, action) => {
            if (state.loading === 'idle') {
                state.loading = 'pending';
                state.currentRequestId = action.meta.requestId;
            }
        },
        [fetchAll.fulfilled]: (state, action) => {
            state.users = action.payload;
            state.loading = 'idle';
        },
        [fetchAll.rejected]: (state, action) => {
            const { requestId } = action.meta;
            if (state.loading === 'pending' && state.currentRequestId === requestId) {
                if (action.error.message === 'Unauthorized') {
                    state.loading = 'Unauthorized';
                    state.error = action.error;
                    state.currentRequestId = undefined;
                }
                else if (action.error.message === 'Token Expired') {
                    state.loading = 'idle';
                    state.error = action.error;
                    state.currentRequestId = undefined;
                }
                else {
                    state.loading = 'idle';
                    state.error = action.error;
                    state.currentRequestId = undefined;
                }
            }
        },
        [deleteUser.fulfilled]: (state, action) => {
            state.users = state.users.filter(function( user ) {
                return user.id !== action.payload.id;
            });
        }
    }
});


export default usersSlice.reducer;
