import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import styles from "../styles/Home.module.css";
import utilStyle from "../styles/utils.module.css";
import Layout, { siteTitle } from "../components/Layout";
import { getPostsData } from "../lib/post";

// SSGの場
// 外部から一回だけデータを持ってくる getStaticProps
export async function getStaticProps() {
  const allPostsData = getPostsData(); // id, title, date, thumbnail
  // console.log(allPostsData);
  return {
    // getStaticProps特有の書き方
    // propsという形でallPostDataを渡す
    props: {
      allPostsData,
    },
  };
}

//SSRの場合(contextにはrequestされたときのパラメータが入る)
// export async function getServerSideProps(context) {
//   return {
//     props: {
//       //コンポーネントに渡すためのprops
//     },
//   };
// }

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyle.headingMd}>
        <p>私はエンジニアです</p>
      </section>
      <section>
        <h2>📝エンジニアのブログ</h2>
        <div className={styles.grid}>
          {allPostsData.map(({ id, title, date, thumbnail }) => (
            <article key={id}>
              <Link href={`/posts/${id}`}>
                <img
                  src={`${thumbnail}`}
                  className={styles.thumbnailImage}
                ></img>
              </Link>
              <Link href={`/posts/${id}`}>
                <a className={utilStyle.boldText}>
                  {title}
                </a>
              </Link>
              <br />
              <small className={utilStyle.lightText}>{date}</small>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
