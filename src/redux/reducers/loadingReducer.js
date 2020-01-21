// Used to indicate if resources which may take a while to
// produce are in progress
const loadingReducer = (state = false, action) => {
    switch (action.type) {
      case 'START_LOADING':
        console.log("here");
        return true;
      case 'STOP_LOADING':
        console.log("here");
        return false;
      default:
        return state;
    }
  };

export default loadingReducer;