import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET || 'secret';
export const verifyToken  = async (req: FastifyRequest, res: FastifyReply) => {
    const { headers } = req;

    if (!headers.authorization) {
      res.code(401).send({ error: 'Unauthorized' });
      return;
    }
  
    const token = headers.authorization.replace('Bearer ', '');
  
    try {
        const decoded = verify(token, secret,) as { [key: string]: any };

        req.headers['tokenPayload'] = JSON.stringify(decoded)
    
        return;
      } catch (error) {
        // Return an error if the token verification fails
        res.code(401).send({ error: 'Invalid token' });
        return;
      }
    
  

}