import { get_day_routine } from './service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const routine_id = Number(searchParams.get('routine_id'));
    const day = Number(searchParams.get('day'));

    if (isNaN(routine_id) || isNaN(day)) {
      return Response.json({ error: 'Missing or invalid parameters' }, { status: 400 });
    }

    const data = await get_day_routine(routine_id, day);
    return Response.json(data);
  } catch (error: any) {
    return Response.json({ error: error }, { status: 500 });
  }
}
