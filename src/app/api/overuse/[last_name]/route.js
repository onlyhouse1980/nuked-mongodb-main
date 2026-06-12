import { NextResponse } from 'next/server';



export async function GET(_request, context) {
  const { last_name } = await context.params;
  const match = [].find((entry) => entry.last_name === last_name);

  if (match) {
    return NextResponse.json(match, { status: 200 });
  }

  return NextResponse.json(
    { message: `User with last_name: ${last_name} not found.` },
    { status: 404 },
  );
}
