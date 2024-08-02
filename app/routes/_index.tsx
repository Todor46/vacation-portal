import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { prisma } from '~/utils/db.server';

type LoaderData = {
  startDate: string | Date;
  endDate: string | Date;
  requester: {
    name: string;
  };
};

export default function Index() {
  const vacations = useLoaderData<LoaderData[]>();

  return (
    <div className="container sm:px-32 sm:py-10">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={vacations.map((vacation) => ({
          title: vacation.requester.name,
          start: vacation.startDate,
          end: vacation.endDate,
          allDay: true,
        }))}
        eventBorderColor="#fff"
      />
    </div>
  );
}

export async function loader() {
  try {
    const vacations = await prisma.vacationRequest.findMany({
      where: {
        status: 'APPROVED',
      },
      include: {
        requester: {
          select: {
            name: true,
          },
        },
      },
    });
    return json<LoaderData[]>(vacations);
  } catch (err) {
    console.error(err);
    return json({}, { status: 500 });
  }
}
