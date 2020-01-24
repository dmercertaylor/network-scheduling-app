// Used to indicate if resources which may take a while to
// produce are in progress
const loadingReducer = (state = false, action) => {
    switch (action.type) {
      case 'START_LOADING':
        return true;
      case 'STOP_LOADING':
        return false;
      default:
        return state;
    }
  };

export default loadingReducer;