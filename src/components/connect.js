import { PropTypes, Component, createElement } from 'react';
import isPlainObject from 'lodash/isPlainObject';
import hoistStatics from 'hoist-non-react-statics';
import invariant from 'invariant';

const defaultMapStateToProps = state => ({}) // eslint-disable-line no-unused-vars
const defaultMergeProps = (stateProps, parentProps) => ({
  ...parentProps,
  ...stateProps
})

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

// Helps track hot reloading.
let nextVersion = 0

export default function connect(mapStateToProps, mergeProps, options = {}) {
  const shouldSubscribe = Boolean(mapStateToProps)
  const mapState = mapStateToProps || defaultMapStateToProps

  const finalMergeProps = mergeProps || defaultMergeProps
  const checkMergedEquals = finalMergeProps !== defaultMergeProps
  const { pure = true, withRef = false } = options

  // Helps track hot reloading.
  const version = nextVersion++

  function computeMergedProps(stateProps, dispatchProps, parentProps) {
    const mergedProps = finalMergeProps(stateProps, dispatchProps, parentProps)
    invariant(
      isPlainObject(mergedProps),
      '`mergeProps` must return an object. Instead received %s.',
      mergedProps
    )
    return mergedProps
  }

  return function wrapWithConnect(WrappedComponent) {
    class Connect extends Component {

      constructor(props, context) {
        super(props, context)
        this.version = version
        this.store = props.store || context.store

        invariant(this.store,
          `Could not find "store" in either the context or ` +
          `props of "${this.constructor.displayName}". ` +
          `Either wrap the root component in a <Provider>, ` +
          `or explicitly pass "store" as a prop to "${this.constructor.displayName}".`
        )

        this.clearCache()

      }

      clearCache() {
        this.stateProps = null
        this.mergedProps = null
        this.renderedElement = null
        this.finalMapStateToProps = null
      }

      render() {
        const {
          renderedElement
        } = this
        let merged = Object.assign({}, this.props, mapState(this.store))

        if (withRef) {
          this.renderedElement = createElement(WrappedComponent, {
            ...this.mergedProps,
            ref: 'wrappedInstance'
          })
        } else {
          this.renderedElement = createElement(
            WrappedComponent,
            merged
          )
        }

        return this.renderedElement
      }
    }

    Connect.displayName = `Connect(${getDisplayName(WrappedComponent)})`
    Connect.WrappedComponent = WrappedComponent
    Connect.contextTypes = {
      store: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
      ]).isRequired
    }
    Connect.propTypes = {
      store: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
      ])
    }

    if (process.env.NODE_ENV !== 'production') {
      Connect.prototype.componentWillUpdate = function componentWillUpdate() {
        if (this.version === version) {
          return
        }

        // We are hot reloading!
        this.version = version
        this.clearCache()
      }
    }

    return hoistStatics(Connect, WrappedComponent)
  }
}
