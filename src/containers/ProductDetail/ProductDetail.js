import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import { loadProduct } from 'redux/modules/ProductDetail';
import Helmet from 'react-helmet';

@asyncConnect([{
  promise: (options) => {
    const {
      store: { dispatch },
      params: { slug },
    } = options;
    return dispatch(loadProduct(slug));
  }
}])
@connect(
  state => ({ productData: JSON.parse(state.ProductDetail.data.text) }),
  dispatch => bindActionCreators({ loadProduct }, dispatch))
export default class ProductDetail extends Component {
  static propTypes = {
    productData: PropTypes.object,
    loadProduct: PropTypes.func.isRequired,
    params: PropTypes.object
  }

  render() {
    let { productData, loadProduct } = this.props; // eslint-disable-line no-shadow
    const slug = this.props.params.slug;
    const styles = require('./ProductDetail.scss');
    productData = productData || { seo: {}, product: {}, image: {} };
    return (
      <div className={`${styles.infoBar} well`}>
        <Helmet title={productData.seo.title} />
        <div className="container">
          <h1>{productData.product.title}</h1>
          <img src={productData.product.image && productData.product.image.url || ''} alt={productData.product.title} />
          <p>{productData.product.details}</p>
          <p>{productData.product.price}</p>
          <button className="btn btn-primary" onClick={loadProduct.bind(this, slug)}>Reload from server</button>
        </div>
      </div>
    );
  }
}
