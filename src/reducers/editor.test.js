import reducer from './editor';
import {
  ADD_TAG,
  REMOVE_TAG
} from '../constants/actionTypes';

describe('editor reducer', () => {
  it('ADD_TAG: does not add empty tag input (empty string) and clears tagInput', () => {
    const initialState = {
      tagInput: '',
      tagList: ['react']
    };

    const nextState = reducer(initialState, { type: ADD_TAG });

    expect(nextState.tagList).toEqual(['react']);
    expect(nextState.tagInput).toBe('');
  });

  it('ADD_TAG: does not add empty tag input (whitespace only) and clears tagInput', () => {
    const initialState = {
      tagInput: '   ',
      tagList: ['react']
    };

    const nextState = reducer(initialState, { type: ADD_TAG });

    expect(nextState.tagList).toEqual(['react']);
    expect(nextState.tagInput).toBe('');
  });

  it('ADD_TAG: does not add case-insensitive duplicate (React vs react) and clears tagInput', () => {
    const initialState = {
      tagInput: 'React',
      tagList: ['react']
    };

    const nextState = reducer(initialState, { type: ADD_TAG });

    expect(nextState.tagList).toEqual(['react']);
    expect(nextState.tagInput).toBe('');
  });

  it('ADD_TAG: trims and stores canonical tag value (trim before storing, preserve original casing after trim)', () => {
    const initialState = {
      tagInput: ' vue ',
      tagList: ['react']
    };

    const nextState = reducer(initialState, { type: ADD_TAG });

    expect(nextState.tagList).toEqual(['react', 'vue']);
    expect(nextState.tagInput).toBe('');
  });

  it('REMOVE_TAG: removes exact-match tag string (regression)', () => {
    const initialState = {
      tagInput: '',
      tagList: ['react', 'vue']
    };

    const nextState = reducer(initialState, { type: REMOVE_TAG, tag: 'react' });

    expect(nextState.tagList).toEqual(['vue']);
    expect(nextState.tagInput).toBe('');
  });
});
