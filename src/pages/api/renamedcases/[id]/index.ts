import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { renamedcaseValidationSchema } from 'validationSchema/renamedcases';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.renamedcase
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getRenamedcaseById();
    case 'PUT':
      return updateRenamedcaseById();
    case 'DELETE':
      return deleteRenamedcaseById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRenamedcaseById() {
    const data = await prisma.renamedcase.findFirst(convertQueryToPrismaUtil(req.query, 'renamedcase'));
    return res.status(200).json(data);
  }

  async function updateRenamedcaseById() {
    await renamedcaseValidationSchema.validate(req.body);
    const data = await prisma.renamedcase.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteRenamedcaseById() {
    const data = await prisma.renamedcase.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
