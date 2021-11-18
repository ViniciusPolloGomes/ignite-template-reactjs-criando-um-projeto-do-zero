import style from'../Header/header.module.scss';
import Link from 'next/link';

export default function Header():JSX.Element {
  return(
      <header className={style.contentContainer}>
        <Link href="/">
          <img src="/images/logo.png" alt="logo"/>
        </Link>
      </header>
  );
}
