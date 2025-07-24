import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    watchlist: [],
    selectedPortfolio: null,
};

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {
        addToWatchList: (state, action) => {
            const ticker = action.payload.toUpperCase();
            if (!state.watchlist.includes(ticker)) {
                state.watchlist.push(ticker);
            }
        },
        removeFromWatchlist: (state, action) => {
            state.watchlist = state.watchlist.filter(ticker => ticker !== action.payload);
        },
        setSelectedPortfolio: (state, action) => {
            state.selectedPortfolio = action.payload;
        },
        resetWatchlist: (state) => {
            state.watchlist = [];
        }
    },
});

export const{
    addToWatchList,
    removeFromWatchlist,
    setSelectedPortfolio,
    resetWatchlist,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;