// These strings must be unique to this redux module ('store') - or else collisions may clobber other store actions
const LOAD = 'redux-example/LOAD_PRODUCT';
const LOAD_SUCCESS = 'redux-example/LOAD_PRODUCT_SUCCESS';
const LOAD_FAIL = 'redux-example/LOAD_PRODUCT_FAIL';

import superagent from 'superagent';

const initialState = {
  loaded: false
};

export default function ProductDetail(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.ProductDetail && globalState.ProductDetail.loaded;
}

export function loadProduct(slug) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: () => {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
      return superagent.get(`https://origindev.thefreshmarket.com/api/content/productPage/${slug}`);
    }
  };
}
