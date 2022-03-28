import {
  Compare,
  Footer,
  Header,
  History,
  Layout,
  Feed,
} from '../layouts/index'

export default function Home() {
  return (
    <div>
      <Layout>
        {/* Header with stock metadata */}
        <Header />

        {/* Chart with history prices */}
        <History />

        {/* List stocks */}
        <Compare />

        {/* News feed filtered to forex's category */}
        <Feed />

        {/* Credits */}
        <Footer />
      </Layout>
    </div>
  )
}
