import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Pagination } from 'antd'
class reportTemplateItem extends Component {
  static propTypes = {
    pageSizeOptions: PropTypes.array,
    total: PropTypes.number,
    current: PropTypes.number,
    pageSize: PropTypes.number,
  }
  static defaultProps = {
    pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
    total: 0,
    current: 1,
    pageSize: 30,
  }
  constructor(props) {
    super(props)
  }
  render() {
    const { pageSizeOptions, total, current, pageSize } = this.props
    return (
      <Fragment>
        {total ? (
          <div
            className="pagination"
            style={{
              marginTop: 15,
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <Pagination
              pageSizeOptions={pageSizeOptions}
              pageSize={pageSize}
              showQuickJumper
              showSizeChanger
              showTotal={this.showTotal}
              current={current}
              total={total}
              onChange={this.onChange}
              onShowSizeChange={this.onShowSizeChange}
              style={{ float: 'right' }}
            />
          </div>
        ) : (
          ''
        )}
      </Fragment>
    )
  }
  showTotal(total) {
    return `总计 ${total} 条`
  }
  // 页码变化时将当前页和每页条数传出去
  onChange = (pageNumber, pageSize) => {
    this.props.handleChange(pageNumber, pageSize)
  }
  // 每页条数变化时将当前页和每页条数传出去
  onShowSizeChange = (current, pageSize) => {
    this.props.handleChange(1, pageSize)
  }
}
export default reportTemplateItem
