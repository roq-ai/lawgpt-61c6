import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { lawfirmValidationSchema } from 'validationSchema/lawfirms';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getLawfirms();
    case 'POST':
      return createLawfirm();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getLawfirms() {
    const data = await prisma.lawfirm
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'lawfirm'));
    return res.status(200).json(data);
  }

  async function createLawfirm() {
    await lawfirmValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.Renamedcase?.length > 0) {
      const create_Renamedcase = body.Renamedcase;
      body.Renamedcase = {
        create: create_Renamedcase,
      };
    } else {
      delete body.Renamedcase;
    }
    const data = await prisma.lawfirm.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
