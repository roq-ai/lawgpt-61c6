import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { similarCaseValidationSchema } from 'validationSchema/similar-cases';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getSimilarCases();
    case 'POST':
      return createSimilarCase();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSimilarCases() {
    const data = await prisma.similar_case
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'similar_case'));
    return res.status(200).json(data);
  }

  async function createSimilarCase() {
    await similarCaseValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.similar_case.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
