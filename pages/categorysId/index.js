import * as React from 'react'
import { connect } from 'react-redux'
import Presentational from './Presentational'
import 'isomorphic-unfetch'

class Container extends React.Component {
  render() {
    return <Presentational {...this.props} />
  }
}

Container.fetchRemoteData = async args => {
  const { req, store, query } = args
  const categoryId = (query && query.id) || (req && req.params && req.params.id)
  const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : ''

  const { authors, categorys, storys } = store.getState()
  const authorListState =
    authors.authorList && authors.authorList.length > 0 ? authors.authorList : null
  const categoryListState =
    categorys.categoryList && categorys.categoryList.length > 0 ? categorys.categoryList : null
  const storyListState = storys.storyList && storys.storyList.length > 0 ? storys.storyList : null

  let _storyList, categoryList, authorList

  if (storyListState && categoryListState && authorListState) {
    return {
      storyList: storyListState,
      categoryList: categoryListState,
      authorList: authorListState
    }
  }

  if (!storyListState && categoryListState && authorListState) {
    _storyList = await fetch(`${baseUrl}/api/storys?categoryId=${categoryId}`).then(res =>
      res.json()
    )
    authorList = authorListState
    categoryList = categoryListState
  }

  if (!storyListState && (!categoryListState || !authorListState)) {
    ;[_storyList, categoryList, authorList] = await Promise.all([
      fetch(`${baseUrl}/api/storys?categoryId=${categoryId}`).then(res => res.json()),
      fetch(`${baseUrl}/api/categorys`).then(res => res.json()),
      fetch(`${baseUrl}/api/authors`).then(res => res.json())
    ])
  }

  const storyList = _storyList.map(item => {
    const { author: authorId, categorys: categoryIdList } = item
    const author = authorList.find(authorItem => authorItem.id === authorId)
    const categorys = categoryIdList
      .map(({ id }) => categoryList.find(catItem => catItem.id === id))
      .filter(item => item && item.id)
    return { ...item, author, categorys }
  })

  return { storyList, categoryList, authorList }
}

Container.resetStoryList = args => {
  const { store } = args
  return store.dispatch({ type: 'SET_STORY_LIST', storyList: [] })
}
Container.getInitialProps = async args => {
  Container.resetStoryList(args)
  const { store, req, query } = args
  const categoryId = (query && query.id) || (req && req.params && req.params.id)
  const { storyList, categoryList, authorList } = await Container.fetchRemoteData(args)
  const currentCategory = categoryList.find(item => item.id === categoryId)
  const system = { currentCategory }
  store.dispatch({ type: 'SET_STORY_LIST', storyList })
  store.dispatch({ type: 'SET_CATEGORYS_LIST', categoryList })
  store.dispatch({ type: 'SET_AUTHORS_LIST', authorList })
  store.dispatch({ type: 'SET_SYSTEM', system })
  return {}
}

const mapStateToProps = (state, ownProps) => {
  return {
    storyList: state.storys.storyList,
    categoryList: state.categorys.categoryList,
    authorList: state.authors.authorList,
    system: state.system
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    initStoryList: () => {}
  }
}

const Connecter = connect(
  mapStateToProps,
  mapDispatchToProps
)(Container)

export default Connecter