import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { lawfirmValidationSchema } from 'validationSchema/lawfirms';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.lawfirm
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getLawfirmById();
    case 'PUT':
      return updateLawfirmById();
    case 'DELETE':
      return deleteLawfirmById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getLawfirmById() {
    const data = await prisma.lawfirm.findFirst(convertQueryToPrismaUtil(req.query, 'lawfirm'));
    return res.status(200).json(data);
  }

  async function updateLawfirmById() {
    await lawfirmValidationSchema.validate(req.body);
    const data = await prisma.lawfirm.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    if (req.body.name) {
      await roqClient.asUser(roqUserId).updateTenant({ id: user.tenantId, tenant: { name: req.body.name } });
    }
    return res.status(200).json(data);
  }
  async function deleteLawfirmById() {
    const data = await prisma.lawfirm.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
