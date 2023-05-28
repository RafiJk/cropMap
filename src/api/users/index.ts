// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma, User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const list = ['lskdjf', 'lskdjfldsf']

  // for (let x of list) {
  //   await prisma.user.create({data: {name: x, email: 'sldkfj'}})
  // }
  const users = await prisma.user.findMany()
  res.status(200).json({users})
}
