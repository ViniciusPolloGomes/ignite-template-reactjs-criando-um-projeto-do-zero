import style from'../Header/header.module.scss';

export default function Header():JSX.Element {
  return(
      <header className={style.contentContainer}>
        <img src="/images/logo.png" alt="Logotipo"/>
      </header>
  );
}
