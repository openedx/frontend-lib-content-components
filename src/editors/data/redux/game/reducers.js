import { createSlice } from '@reduxjs/toolkit';
import { StrictDict } from '../../../utils';

const initialState = {
  settings: {
    shuffle: true,
    timer: true,
  },

  // type must be a lowercase string indicating the type of game ('flashcards' or 'matching' for now)
  type: 'flashcards',

  list: [{
    term_image: '', definition_image: '', term: '', definition: '', id: 1, editorOpen: true,
  }],
  // a counter to keep track of the total number of items that have been added to the list
  listCounter: 1,
};

// eslint-disable-next-line no-unused-vars
const game = createSlice({
  name: 'game',
  initialState,

  reducers: {
  // Settings Reducers
    shuffleTrue: (state) => ({
      ...state,
      settings: { ...state.settings, shuffle: true },
    }),
    shuffleFalse: (state) => ({
      ...state,
      settings: { ...state.settings, shuffle: false },
    }),
    timerTrue: (state) => ({
      ...state,
      settings: { ...state.settings, timer: true },
    }),
    timerFalse: (state) => ({
      ...state,
      settings: { ...state.settings, timer: false },
    }),
    updateType: (state, { payload }) => ({
      ...state,
      type: payload,
    }),

    // List Reducers
    updateTerm: (state, { payload }) => {
      const { index, term } = payload;
      const newCard = { ...state.list[index] };

      newCard.term = term;

      const newList = [...state.list];
      newList[index] = newCard;
      return {
        ...state,
        list: newList,
      };
    },
    updateDefinition: (state, { payload }) => {
      const { index, definition } = payload;
      const newCard = { ...state.list[index] };

      newCard.definition = definition;

      const newList = [...state.list];
      newList[index] = newCard;
      return {
        ...state,
        list: newList,
      };
    },
    updateTermImage: (state, { payload }) => {
      const { index, termImage } = payload;
      const newCard = { ...state.list[index] };

      newCard.term_image = termImage;

      const newList = [...state.list];
      newList[index] = newCard;
      return {
        ...state,
        list: newList,
      };
    },
    updateDefinitionImage: (state, { payload }) => {
      const { index, definitionImage } = payload;
      const newCard = { ...state.list[index] };

      newCard.definition_image = definitionImage;

      const newList = [...state.list];
      newList[index] = newCard;
      return {
        ...state,
        list: newList,
      };
    },

    toggleOpen: (state, { payload }) => {
      const { index, isOpen } = payload;
      const newCard = { ...state.list[index] };

      newCard.editorOpen = isOpen;

      const newList = [...state.list];
      newList[index] = newCard;
      return {
        ...state,
        list: newList,
      };
    },

    setList: (state, { payload }) => ({
      ...state,
      list: payload,
    }),
    addCard: (state) => {
      const newListCounter = state.listCounter + 1;
      return {
        ...state,
        listCounter: newListCounter,
        list: [...state.list,
          {
            term_image: '',
            definition_image: '',
            term: '',
            definition: '',
            id: newListCounter,
            editorOpen: true,
          }],
      };
    },
    removeCard: (state, { payload }) => {
      const { index } = payload;
      const newList = [...state.list];
      newList.splice(index, 1);
      return {
        ...state,
        list: newList,
      };
    },
  },
});

const actions = StrictDict(game.actions);

const { reducer } = game;

export {
  actions,
  initialState,
  reducer,
};
