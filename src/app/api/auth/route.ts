import { NextApiRequest, NextApiResponse } from 'next';

import { findOrCreateuser } from './service';

export async function POST(req: Request, res: NextApiResponse) {
  try {
    return await findOrCreateuser(req);
  } catch (error: any) {
    return Response.json({ error: error }, { status: 403 });
  }
}
