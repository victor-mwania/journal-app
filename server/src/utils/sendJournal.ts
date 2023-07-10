import { JournalEntry, User } from "prisma/prisma-client";
import nodemailer from "nodemailer";
import { db } from "../plugins/db";
import dotenv from "dotenv";

dotenv.config();

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
        console.log(`error sending journal entry ${randomEntry.id}`);
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
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Daily Journal Entry",
      text: `Here is your random journal entry for today:\n\n${entry.entry}`,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
}
export { sendJournals };
