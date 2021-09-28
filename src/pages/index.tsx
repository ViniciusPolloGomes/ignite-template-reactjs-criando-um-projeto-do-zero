import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client'
import Link from 'next/link';
import { getPrismicClient } from '../services/prismic';
import { useState } from 'react';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Head from 'next/head';

import React from 'react';
import { BiUser, BiCalendar } from "react-icons/bi";

interface Post {
  uid: string;
  slug: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
  updatedAt: string;
}



interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {

  const [newpostspagination, setPostPagination] = useState<PostPagination>(postsPagination);
  const [newnextpage, setNextPage] = useState(postsPagination.next_page);
  const [newposts, setPosts] = useState<Post[]>(newpostspagination.results);


  async function handleLoadingPosts(e: Post[]) {

    const response: PostPagination = await fetch(newnextpage)
      .then(resp => resp.json())

    //console.log(response.results)
   
    const results = response.results.map(post => {
      return {
        uid: post.uid,
        slug: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
        updatedAt: new Date(post.first_publication_date).toLocaleDateString('pt-br', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      };
    });
   
    setPosts(e.concat(results));

    setNextPage(response.next_page)
    
  }
  //console.log(newposts)
    return (
      <>
        <Head>
          <title>
            Home - Spacetraveling
          </title>
        </Head>
        <main className={styles.container} >
          <div  className={styles.content}>
            {newposts.map(post => (
              <Link  href={`/post/${post.slug}`}>
                <a key={post.slug}>
                  <strong>{post.data.title}</strong>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.footerpost}>
                    <BiCalendar color='#BBBBBB' size={16} />
                    <time>{post.updatedAt}</time>
                    <BiUser color='#BBBBBB' size={16} />
                    <strong>{post.data.author}</strong>
                  </div>
                </a>
              </Link>
            ))}
            {newnextpage ? <button onClick={() => handleLoadingPosts(newposts)}>Carregar mais...</button>:''}
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
      fetch: ['posts.title', 'posts.content', 'posts.author', 'posts.subtitle'],
      pageSize: 1,
      page: 1,
    })

    //console.log(postsResponse);
    //console.log(JSON.stringify(postsResponse,null,2));

    const next_page = postsResponse.next_page;

    //console.log(JSON.stringify(nextpage));

    const results = postsResponse.results.map(post => {
      return {
        slug: post.uid,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
        updatedAt: new Date(post.first_publication_date).toLocaleDateString('pt-br', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      };
    });

    return {
      props: {
        postsPagination: { results, next_page }
      }
    }

  }