import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAssets, uploadAsset, deleteAsset } from '../../services/api';

// Thunks
export const fetchAssets = createAsyncThunk(
    'assets/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await getAssets();
            return res.data.assets;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch assets');
        }
    }
);

export const uploadAssetThunk = createAsyncThunk(
    'assets/upload',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await uploadAsset(formData);
            return res.data.asset;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Upload failed');
        }
    }
);

export const deleteAssetThunk = createAsyncThunk(
    'assets/delete',
    async (id, { rejectWithValue }) => {
        try {
            await deleteAsset(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Delete failed');
        }
    }
);

const assetSlice = createSlice({
    name: 'assets',
    initialState: {
        assets: [],
        loading: false,
        uploading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch
        builder.addCase(fetchAssets.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAssets.fulfilled, (state, action) => {
            state.loading = false;
            state.assets = action.payload;
        });
        builder.addCase(fetchAssets.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Upload
        builder.addCase(uploadAssetThunk.pending, (state) => {
            state.uploading = true;
            state.error = null;
        });
        builder.addCase(uploadAssetThunk.fulfilled, (state, action) => {
            state.uploading = false;
            state.assets.unshift(action.payload);
        });
        builder.addCase(uploadAssetThunk.rejected, (state, action) => {
            state.uploading = false;
            state.error = action.payload;
        });

        // Delete
        builder.addCase(deleteAssetThunk.fulfilled, (state, action) => {
            state.assets = state.assets.filter(a => a._id !== action.payload);
        });
        builder.addCase(deleteAssetThunk.rejected, (state, action) => {
            state.error = action.payload;
        });
    },
});

export const { clearError } = assetSlice.actions;
export default assetSlice.reducer;

// Selectors
export const selectAssets = (state) => state.assets.assets;
export const selectAssetsLoading = (state) => state.assets.loading;
export const selectUploading = (state) => state.assets.uploading;
export const selectAssetError = (state) => state.assets.error;