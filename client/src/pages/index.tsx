import {
  Compare,
  Footer,
  Header,
  History,
  Layout
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

        {/* Credits */}
        <Footer />
      </Layout>
    </div>
  )
}
