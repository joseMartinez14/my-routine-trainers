import { findOrCreateuser } from './service';

export async function POST(req: Request) {
  try {
    return await findOrCreateuser(req);
  } catch (error: any) {
    return Response.json({ error: error }, { status: 403 });
  }
}
