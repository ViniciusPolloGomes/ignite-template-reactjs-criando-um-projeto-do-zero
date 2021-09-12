import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client'
import Link from  'next/link';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import Head from 'next/head';
import  {RichText}  from 'prismic-dom';
import React from 'react';

interface Post {
  excerpt:string;
  updatedAt: string;
  slug: string;
  first_publication_date: string | null;

  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}
interface PostsProps{
  posts: Post[];
}
interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

 export default function Home({posts} : PostsProps) {

return(
  <>
    <Head>
      <title>
        Home - Spacetraveling
      </title>
    </Head>
    <main>
      <div>
          {posts.map(post => (
            <Link href={`/post/${post.slug}`}>
              <a key={post.slug}>
                
                <p>{post.excerpt}</p>
                <time>{post.updatedAt}</time>
                
              </a>
            </Link>
          ))}
      </div>
    </main>
  </>
);
     
}

 export const getStaticProps :GetStaticProps = async () => {
   const prismic = getPrismicClient();
   const postsResponse = await prismic.query([
     Prismic.predicates.at('document.type','posts')
   ],{
     fetch:['posts.title','posts.content','posts.author'],
     pageSize:100,
   })
   // console.log(postsResponse);
   // console.log(JSON.stringify(postsResponse,null,2));
  
   const posts = postsResponse.results.map(post => {
    return {
      slug: post.uid,
    //title: RichText.asText(post.data.title),
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-br', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
      })
    };
  });

  return {
      props: { posts }
  }
 };
