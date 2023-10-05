import styles from "./Header.module.css";
import IgniteLogo from "../assets/logo.svg";

export function Header() {
  return (
    <header className={styles.header}>
      <img src={IgniteLogo} alt="logo tipo do ignite" />
    </header>
  );
}
