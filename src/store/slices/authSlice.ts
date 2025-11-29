import {createAsyncThunk, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {LoginCredentials, RegisterFormData, User} from "../../types";
import {apiLogin, apiRegister, apiGetCurrentUser} from "../../services/authApi.ts";
import type {RootState} from "../store.ts";

// Type
export interface AuthState {
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    isInitialized: boolean;
}

// Initial
const initialState: AuthState = {
    user: null,
    status: 'idle',
    error: null,
    isInitialized: false,
};

// Trunk
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async () => {
        // Clear localStorage
        localStorage.removeItem('currentUserId');
        console.log('Logout thunk: localStorage cleared');
        
        // Return null to clear user state
        return null;
    }
);

// Trunk
export const initializeAuth = createAsyncThunk(
    'auth/initialize',
    async (_, { rejectWithValue }) => {
        try {
            const user = await apiGetCurrentUser();
            return user;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

// Trunk
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const user = await apiLogin(credentials);
            return user;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

// Trunk
export const registerUser = createAsyncThunk(
    'auth/register',
    async (data: RegisterFormData, { rejectWithValue }) => {
        try {
            const user = await apiRegister(data);
            return user;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

// Slices
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            console.log('Redux logout: Clearing user state');
            state.user = null;
            state.status = 'idle';
            state.error = null;
            state.isInitialized = true;
        },
        logoutUser: (state) => {
            state.user = null;
            state.status = 'idle';
            state.error = null;
            state.isInitialized = true;
        },
        initializeAuth: (state) => {
            state.isInitialized = true;
        },
        resetAuthStatus: state => {
            state.status = 'idle';
            state.error = null;
        },
        updateUserInfo: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = {...state.user, ...action.payload};
            }
        }

    },
    extraReducers: (builder) => {
        builder
            // Xử lý initializeAuth
            .addCase(initializeAuth.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(initializeAuth.fulfilled, (state, action: PayloadAction<User | null>) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.isInitialized = true;
                console.log('InitializeAuth fulfilled:', { user: !!action.payload, userId: action.payload?.id });
            })
            .addCase(initializeAuth.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                state.isInitialized = true;
            })
            // Xử lý loginUser
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.isInitialized = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Xử lý registerUser
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.isInitialized = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Xử lý logoutUser
            .addCase(logoutUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.status = 'succeeded';
                state.user = null;
                state.isInitialized = true;
                console.log('Logout thunk: Redux state cleared');
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { logout, resetAuthStatus, updateUserInfo  } = authSlice.actions;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;
export const selectIsInitialized = (state: RootState) => state.auth.isInitialized;
export const selectUserPermissions = (state: RootState) => state.auth.user?.permissions || [];
export const authReducer = authSlice.reducer;
