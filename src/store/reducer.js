import { print } from '../globalFunc';


const initalState = {
    // language: 'en',
    gameStarted: false,
    counterStarted: false
}

const Reducer = (state = initalState, action) => {
    switch(action.type){
        // case 'UPDATE_LANGUAGE':
        //     const newLanguage = state.language === 'en' ? 'zh' : 'en';
        //     print(action.type, 'green', newLanguage)
        //     return { ...state, language: newLanguage }
        case 'START_GAME':
            print(action.type, 'green', true)
            return { ...state, gameStarted: true }
        case 'END_GAME':
            print(action.type, 'green', false)
            return { ...state, gameStarted: false }
        case 'START_COUNTER':
            print(action.type, 'green', true)
            return { ...state, counterStarted: true }
        case 'END_COUNTER':
            print(action.type, 'green', false)
            return { ...state, counterStarted: false }
        default:
            return state;
    }
}

export default Reducer;