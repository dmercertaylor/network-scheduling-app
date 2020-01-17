const matchedReducer = (state = [], action) => {
    switch (action.type) {
      case 'SET_MATCHED_TIMES':
        return action.payload;
      default:
        return state;
    }
  };

export default matchedReducer;