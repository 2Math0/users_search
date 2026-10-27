import type { User } from "./user";
import styles from "./UserCard.module.css";

function UserDetails({ user }: { user: User }) {
  return (
    <div className={styles["display-card"]}>
      <UserInfo
        info={`User${user.id}:`}
        title={user.firstname + " " + user.lastname}
      />
      <UserInfo info={`Email:`} title={user.email} />
    </div>
  );
}

export { UserDetails };

function UserCard({ user }: { user: User }) {
  return (
    <div className={styles["display-card"]}>
      <UserInfo
        info={`User${user.id}:`}
        title={user.firstname + " " + user.lastname}
      />

      <UserInfo info={`Email:`} title={user.email} />
    </div>
  );
}

export { UserCard };

function UserInfo(props: { info: string; title: string | undefined | null }) {
  if (!props.title) {
    return null;
  }
  return (
    <span className={"row"}>
      <span className={styles["user-primary-info"]}>{props.info}</span>
      <span className={styles["user-primary-title"]}>{props.title}</span>
    </span>
  );
}
