import { prisma } from '@/lib/prisma';

export async function findOrCreateuser(req: Request) {
  //Find or create
  //Agarrar la informacion que viene
  //Necesito nombre, correo  y el uuid de firebase
  const data = await req.json();

  //Buscar en la db ese uudi

  const existing = await prisma.trainers.findUnique({
    where: { id: data.uuid },
  });

  //Si si funciona lo devuelvo de una
  //Si no lo creo y lo mando

  if (existing) {
    return Response.json(existing);
  } else {
    console.log('---------');
    const new_user = await prisma.trainers.create({
      data: {
        id: data.uuid,
        name: data.name || '',
        phone: '',
        email: data.email,
        IsActive: false,
        photoURL: '',
      },
    });

    return Response.json(new_user);
  }
}
