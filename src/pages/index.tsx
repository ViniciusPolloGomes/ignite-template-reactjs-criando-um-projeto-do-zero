import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client'
import Link from 'next/link';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import Head from 'next/head';
import { RichText } from 'prismic-dom';
import React from 'react';
import { BiUser, BiCalendar } from "react-icons/bi";

interface Post {
  updatedAt: string;
  slug: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}
interface PostsProps {
  posts: Post[];
}
interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ posts }: PostsProps) {



  return (
    <>
      <Head>
        <title>
          Home - Spacetraveling
        </title>
      </Head>
      <main className={styles.container}>
        <div className={styles.content}>
          {posts.map(post => (
            <Link href={`/post/${post.slug}`}>
              <a key={post.slug}>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <div className={styles.footerpost}>
                  <BiCalendar color='#BBBBBB' size={16}/>
                  <time>{post.updatedAt}</time>
                  <BiUser color='#BBBBBB' size={16}/>
                  <strong>{post.data.author}</strong>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );

}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: ['posts.title', 'posts.content', 'posts.author','posts.subtitle'],
    pageSize: 100, 
  })
    
    
  // console.log(postsResponse);
  // console.log(JSON.stringify(postsResponse,null,2));

  const posts = postsResponse.results.map(post => {
    return {
      slug: post.uid,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-br', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };
  });

  return {
    props: { posts }
  }
};
