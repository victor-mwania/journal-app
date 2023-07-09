import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { compare, genSalt, genSaltSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../types";

export default async function (app: FastifyInstance) {
  app.post(
    "/signup",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            emailAddress: {
              type: "string",
              minLength: 1,
            },
            password: {
              type: "string",
              minLength: 1,
            },
          },
          required: ["emailAddress", "password"],
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
                  token: {
                    type: "string",
                  },
                  user: {
                    id: {
                      type: "string",
                    },
                    emailAddress: {
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
    async (req: FastifyRequest, res: FastifyReply) => {
      req.log.info(req.ip, req.method, req.url);
      const body: unknown = req.body;
      const payload: User = body as User;

      const saltRounds = 10;
      const salt = genSaltSync(saltRounds);
      const passwordHash = hashSync(payload.password, salt);
      const user = await app.db.user.findFirst({
        where: {
          emailAddress: payload.emailAddress,
        },
      });

      if (user) {
        res.status(400).send("user exists with the email address");
      }

      try {
        const newUser = await app.db.user.create({
          data: {
            emailAddress: payload.emailAddress,
            password: passwordHash,
          },
        });

        const { emailAddress, id } = newUser;
        const token = jwt.sign({ id, emailAddress }, "SECRET", {
          expiresIn: "1h",
        });
        return {
          message: "User Created Successfully",
          body: {
            token,
            user: { id, emailAddress },
          },
        };
      } catch (error) {
        res.status(500).send("Internal Server Error");
      }
    }
  );

  app.post(
    "/login",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            emailAddress: {
              type: "string",
              minLength: 1,
            },
            password: {
              type: "string",
              minLength: 1,
            },
          },
          required: ["emailAddress", "password"],
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
                  token: {
                    type: "string",
                  },
                  user: {
                    id: {
                      type: "string",
                    },
                    emailAddress: {
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
    async (req: FastifyRequest, res: FastifyReply) => {
      req.log.info(req.ip, req.method, req.url);
      const body: unknown = req.body;
      const payload: User = body as User;

      const user = await app.db.user.findFirst({
        where: {
          emailAddress: payload.emailAddress,
        },
      });

      if (!user) {
        return res.status(400).send("Invalid credentials");
      }

      try {
        const match = await compare(payload.password, user.password);
        if (match) {
          const { emailAddress, id } = user;
          const token = jwt.sign({ id, emailAddress }, "SECRET", {
            expiresIn: "1h",
          });
          return res.status(200).send({
            message: "Login  Successful",
            body: {
              token,
              user: { id, emailAddress },
            },
          });
        } else {
          return res.status(400).send({
            message: "Invalid Credentials",
          });
        }
      } catch (error) {
        return res.status(400).send("Invalid credentials");
      }
    }
  );
}
