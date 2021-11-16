import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import Header from '../../components/Header';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { Head } from 'next/document';
import Prismic from '@prismicio/client'
import intervalToDuration from 'date-fns/intervalToDuration';
import { useState } from 'react';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';
import { resourceLimits } from 'worker_threads';
import { RichText } from "prismic-dom";
import { format ,parseISO,formatDistance,formatRelative} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'

interface Post {
  slug: string;
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}


export default function Post({ postsResponse }) {
  const post: Post = postsResponse;

  const firstDate = parseISO(post.first_publication_date);
  const secondDate = parseISO(post.first_publication_date);

  const formattedDate = format(firstDate,"dd 'de' MMMM', às ' HH:mm",{locale:ptBR});

  return (
    <>
      <main>
        <article>
          <img src={post.data.banner.url}></img>
          <h1>{post.data.title}</h1>
          <div>
            <time>
              {formattedDate}
            </time>
          <strong>{post.data.author}</strong>
        </div>

        {post.data.content.map(content => (
          <div key={content.heading}>
            <h2>{content.heading}</h2>

            <div
              className={`${styles.postContent}`}
              dangerouslySetInnerHTML={{
                __html: RichText.asHtml(content.body),
              }}
            />

          </div>
        ))}
      </article>
    </main>
    </>
  );
}

export const getStaticPaths = async ({ params }) => {
  const prismic = getPrismicClient();

  const slug = params;

  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: ['posts.title', 'posts.content', 'posts.author', 'posts.subtitle', 'posts.banner.url'],
    pageSize: 100,
  })

  const posts = postsResponse.results.map(post => {
    return {
      slug: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        banner: {
          url: post.data.banner,
        },
        author: post.data.author,
        content: {
          heading: post.data.content.heading,
          body: {
            text: post.data.content.body,
          },
        },
      },
    };
  });

  const paths = posts.map(post => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: true
  }
}


export const getStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();

  const { slug } = params;

  const postsResponse = await prismic.getByUID('posts', String(slug), {});

  return {
    props: { postsResponse }
  }
};
