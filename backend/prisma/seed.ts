import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.booking.createMany({
    data: [
      {
        room: '101',
        guest_name: 'Alice Johnson',
        check_in: new Date('2026-02-02T00:00:00.000Z'),
        check_out: new Date('2026-02-05T00:00:00.000Z'),
        status: 'Confirmed',
      },
      {
        room: '202',
        guest_name: 'Bob Smith',
        check_in: new Date('2026-02-07T00:00:00.000Z'),
        check_out: new Date('2026-02-09T00:00:00.000Z'),
        status: 'Checked-in',
      },
      {
        room: '303',
        guest_name: 'Carlos Ruiz',
        check_in: new Date('2026-02-01T00:00:00.000Z'),
        check_out: new Date('2026-02-04T00:00:00.000Z'),
        status: 'Checked-out',
      },
      {
        room: '104',
        guest_name: 'Dana Lee',
        check_in: new Date('2026-02-10T00:00:00.000Z'),
        check_out: new Date('2026-02-12T00:00:00.000Z'),
        status: 'Cancelled',
      },
    ],
    skipDuplicates: true,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
