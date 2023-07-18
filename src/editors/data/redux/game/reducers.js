import { createSlice } from '@reduxjs/toolkit';
import { StrictDict } from '../../../utils';
import { state } from '../../../sharedComponents/TinyMceWidget/hooks';

const initialState = {
  settings: {
    shuffle: true,
    timer: true,
  },

  type: 'flashcards', // type must be a lowercase string indicating the type of game ('flashcards' or 'matching' for now)

  list: [{
    term_image: '', definition_image: '', term: '', definition: '', id: 1, editorOpen: true,
  }],
  listCounter: 1, // a counter to keep track of the total number of items that have been added to the list. This is used to obtain a unique (but unambiguous) id for the DraggableList to work
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
      const { index, term_image } = payload;
      const newCard = { ...state.list[index] };

      newCard.term_image = term_image;

      const newList = [...state.list];
      newList[index] = newCard;
      return {
        ...state,
        list: newList,
      };
    },
    updateDefinitionImage: (state, { payload }) => {
      const { index, definition_image } = payload;
      const newCard = { ...state.list[index] };

      newCard.definition_image = definition_image;

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

      if (isOpen)
        newCard.editorOpen = true;
      else
        newCard.editorOpen = false;

      const newList = [...state.list];
      newList[index] = newCard;
      return {
        ...state,
        list: newList,
      };
    },

    setList: (state, { payload }) => {
      console.log(payload);
      return {
        ...state,
        list: payload,
      };
    },
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
      const { id } = payload;
      const newList = [...state.list];
      newList.splice(id, 1);
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
