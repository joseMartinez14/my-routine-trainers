import { NextApiRequest, NextApiResponse } from 'next';

import { findOrCreateuser } from './service';

export async function POST(req: Request, res: NextApiResponse) {
  try {
    console.log('11');
    return await findOrCreateuser(req);
  } catch (error: any) {
    // return res.json(
    //   {
    //     error: error.message || 'Forbidden',
    //   },
    //   { status: 403 }
    // );

    return Response.json({ error: error }, { status: 505 });
  }
}
