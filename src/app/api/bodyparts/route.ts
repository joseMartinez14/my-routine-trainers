import { get_bodyparts } from './service';

export async function GET() {
  try {
    const bp = await get_bodyparts();
    return Response.json(bp);
  } catch (error: any) {
    return Response.json({ error: error }, { status: 500 });
  }
}
