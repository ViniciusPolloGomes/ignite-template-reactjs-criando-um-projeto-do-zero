import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import Header from '../../components/Header';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { Head } from 'next/document';
import Prismic from '@prismicio/client'
import intervalToDuration from 'date-fns/intervalToDuration';
import { Key } from 'react';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';

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

interface PostProps {
  post: Post;
}

export default function Post() {
  return (
    <>
      <main>
        <article>
          <img></img>
          <h1>oi</h1>
          <div>
            <time></time>
            <strong></strong>
          </div>
          <h1></h1>
          <strong></strong>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = async ({ params }) => {
  const prismic = getPrismicClient();

  const slug: string = params;

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

  const paths = posts.map(post=> ({
    params: { slug: post.slug },
  }));

  //console.log(paths)

  return {
    paths,
    fallback: true
  }
}


export const getStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();

  const slug: string = params;



  /*const post={
      first_publication_date: response.first_publication_date ;
      data: {
        title: response.data.title ;
        banner: {
          url:  ;
        };
        author: ;
        content: {
          heading:  ;
          body: {
            text:  ;
          }[];
        }[];
      };
    
  }*/

  return {
    props: {  slug }
  }
};
