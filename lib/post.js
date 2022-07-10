import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html"

// posts directoryのpathを取得する
const postsDirectory = path.join(process.cwd(), "posts");
// console.log(postsDirectory);

// mdファイルのデータを取り出す（トップページのブログ一覧出力で使用）
export function getPostsData() {
  // /post配下のファイル名を取得
  const fileNames = fs.readdirSync(postsDirectory);
  // console.log(fileNames);
  const allPostsData = fileNames.map((fileName) => {
    // ファイル名(拡張子以外)をidとする
    const id = fileName.replace(/\.md$/, "");

    // マークダウンファイル(md)を文字列として読み取る
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    // 投稿のメタデータ部分を解析
    const matterResult = matter(fileContents);

    // idとデータを返す
    return {
      id,
      ...matterResult.data,
    };
  });
  return allPostsData;
}

// 動的ルーティング時に設定
// getStaticPathで使うpathを取得する
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  // 以下のような配列を返します:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

// idに基づいてブログ投稿データを返す
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // 投稿のメタデータ部分を解析するためにgray-matterを使う
  const matterResult = matter(fileContents);
  // console.log(matterResult);

  // マークダウンをHTML文字列に変換するためにremarkを使う
  const blogContent = await remark().use(html).process(matterResult.content);

  const blogContentHTML = blogContent.toString();
  console.log(blogContentHTML);

  // データをidと組み合わせる
  return {
    id,
    blogContentHTML,
    ...matterResult.data,
  }
}

