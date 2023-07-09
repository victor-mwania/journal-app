import { JournalEntry, PrismaClient, User } from "prisma/prisma-client";
import { db } from "../plugins/db";

type JournalEntryWithUser = JournalEntry & {
  user: User;
};
const sendJournals = async () => {
  console.log("started sending journal entries");
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const entries = await db.journalEntry.findMany({
    where: {
      createdAt: {
        gte: currentDate,
      },
    },
    include: {
      user: true,
    },
  });

  if (entries.length === 0) {
    console.log("no journal entries for today");
    return;
  }

  const userIds = getUserIdsFromPublishedEntries(entries);
  // Exclude users who have not published on the current day
  const usersToEmail: User[] = await db.user.findMany({
    where: {
      id: {
        in: [...userIds],
      },
    },
  });

  await Promise.all(
    usersToEmail.map(async (user) => {
      const eligibleEntries = entries.filter(
        (entry) => entry.userId !== user.id
      );

      if (eligibleEntries.length === 0) {
        return; // Skip sending email if no eligible entries
      }

      const randomEntry = getRandomEntry(eligibleEntries);
      try {
        await sendEmail(user.emailAddress, randomEntry);
      } catch (error) {
        console.log(`error sending journal entry ${randomEntry.id}`)
      }
    })
  );
};

const getUserIdsFromPublishedEntries = (entries: JournalEntryWithUser[]) => {
  return [...new Set(entries.map((obj) => obj.user.id))];
};

const getRandomEntry = (entries: JournalEntry[]): JournalEntry => {
  const randomIndex = Math.floor(Math.random() * entries.length);
  return entries[randomIndex];
};

async function sendEmail(email: string, entry: JournalEntry): Promise<void> {
  console.log(`send to ${email}  entry ${entry}`);
}
export { sendJournals };
