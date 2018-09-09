import * as React from 'react'
import { Layout } from 'antd'
import css from './Basic.css'
import Drawer from './Drawer'

const { Header, Footer, Content } = Layout

export default class App extends React.Component {
  render() {
    return (
      <Layout>
        {/* <Sider>Sider</Sider> */}
        <Drawer />
        <Layout>
          <Header>Header</Header>
          <Content className={css.layoutContentWrapper}>{this.props.children}</Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    )
  }
}
