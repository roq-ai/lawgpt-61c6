import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { similarCaseValidationSchema } from 'validationSchema/similar-cases';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.similar_case
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getSimilarCaseById();
    case 'PUT':
      return updateSimilarCaseById();
    case 'DELETE':
      return deleteSimilarCaseById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSimilarCaseById() {
    const data = await prisma.similar_case.findFirst(convertQueryToPrismaUtil(req.query, 'similar_case'));
    return res.status(200).json(data);
  }

  async function updateSimilarCaseById() {
    await similarCaseValidationSchema.validate(req.body);
    const data = await prisma.similar_case.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteSimilarCaseById() {
    const data = await prisma.similar_case.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
