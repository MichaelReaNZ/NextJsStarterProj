import styles from "./page.module.css";

import UserCard from "../../components/UserCard/UserCard";
import { prisma } from "../lib/Clients/prisma";

export default async function Users() {
  // throw new Error("This is a test error");
  const users = await prisma.user.findMany();

  return (
    <div className={styles.grid}>
      {users.map((user) => {
        return <UserCard key={user.id} {...user} />;
      })}
    </div>
  );
}
