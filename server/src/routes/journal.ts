import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { JournalEntry, TokenPayload } from "../types";
import { verifyToken } from "../utils";

export default async function (app: FastifyInstance) {
  app.post(
    "/create",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            entry: {
              type: "string",
              minLength: 1,
              maxLength: 500,
            },
          },
          required: ["entry"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              message: {
                type: "string",
              },
              body: {
                type: "object",
                properties: {
                  journalEntry: {
                    type: "object",
                    properties: {
                      entry: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      preHandler: verifyToken,
    },
    async (req: FastifyRequest, res: FastifyReply) => {
      req.log.info(req.ip, req.method, req.url);
      const body: unknown = req.body;
      const payload: JournalEntry = body as JournalEntry;

      const token = req.headers["tokenPayload"];

      if (!token) {
        res.code(401).send({ error: "Invalid token" });
      }
      if (typeof token === "string") {
        const tokenPayload: TokenPayload = JSON.parse(token);

        try {
          const entry = await app.db.journalEntry.create({
            data: {
              entry: payload.entry,
              userId: tokenPayload.id,
            },
          });
          return res.status(200).send({
            message: "Journal Entry Created Successfully",
            body: {
              journalEntry: { ...entry },
            },
          });
        } catch (error) {
          return res.status(500).send("Internal Server Error");
        }
      }
      return res.status(500).send("Internal Server Error");
    }
  );
}
