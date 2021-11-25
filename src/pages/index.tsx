import { GetStaticProps } from 'next';

import Link from 'next/link';

import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';

import React from 'react';
import { useState } from 'react';

import Prismic from '@prismicio/client'
import { getPrismicClient } from '../services/prismic';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'

import { BiUser, BiCalendar } from "react-icons/bi";

import styles from './home.module.scss';
import commonStyles from '../styles/common.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
    const [posts, setPosts] = useState<Post[]>(postsPagination.results);
    const [hasMorePosts, setHasMorePosts] = useState(!!postsPagination.next_page);

  async function handleLoadMorePosts(): Promise<void> {
    const loadMorePostsResponse: ApiSearchResponse = await (
      await fetch(postsPagination.next_page)
    ).json();

    setPosts(oldPosts => [...oldPosts, ...loadMorePostsResponse.results]);
    setHasMorePosts(!!loadMorePostsResponse.next_page);
  }

    return (
      <div className={`${commonStyles.contentContainer} ${styles.container}`}>
        <header>
         <img src="/logo.svg" alt="logo" />
        </header>

        <main>
          {posts.map(post => {
            return(
              <Link href={`/post/${post.uid}`} key={post.uid}>
                <a className={styles.post}>
                  <article>
                    <h2>{post.data.title}</h2>
                    <p>{post.data.subtitle}</p>
                    <section>
                      <div >
                        <BiCalendar color='#BBBBBB' size={16} />
                        <span style={{ textTransform: 'capitalize' }}>
                          {format(
                            new Date(post.first_publication_date),
                            'dd MMM yyyy',
                            {
                              locale: ptBR,
                            }
                          )}
                          </span>
                        </div>

                        <div>
                          <BiUser color='#BBBBBB' size={16} />
                          <strong>{post.data.author}</strong>
                        </div>
                    </section>
                  </article>
                </a>
              </Link>
            );
          })}

           {hasMorePosts && (
            <button type="button" onClick={handleLoadMorePosts}>
              Carregar mais posts
            </button>
          )}
          
        </main>
      </div>
    );

  }

  export const getStaticProps: GetStaticProps <HomeProps>= async () => {

    const prismic = getPrismicClient();

    const postsResponse = await prismic.query(
      Prismic.predicates.at('document.type', 'posts'),
      {
        pageSize: 1,
        page: 1,
      }
    )

    return {
      props: {
        postsPagination: postsResponse,
      }
    }

  }