import { VacationRequest } from '@prisma/client';
import { ActionFunctionArgs, json } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { prisma } from '~/utils/db.server';
import { ErrorResponse, SuccessResponse } from '~/utils/misc.server';

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  const { id: vacationRequestId } =
    (await request.json()) as CancelVacationRequestPayload;
  console.info('Id', vacationRequestId);
  const vacationRequest = await prisma.vacationRequest.findUnique({
    where: {
      id: vacationRequestId,
    },
  });

  if (!vacationRequest) {
    return json<ErrorResponse>({
      success: false,
      message: 'Vacation request not found',
    });
  }

  if (vacationRequest.requesterId !== user?.id || !user) {
    return json<ErrorResponse>({
      success: false,
      message: 'Unauthorized',
    });
  }

  try {
    await prisma.vacationRequest.update({
      where: {
        id: vacationRequestId,
      },
      data: {
        status: 'CANCELLED',
      },
    });
    return json<SuccessResponse<VacationRequest>>({
      success: true,
    });
  } catch (err) {
    console.error(err);
    return json<ErrorResponse>({
      success: false,
      message: 'Error cancelling vacation request',
    });
  }
}

export type CancelVacationRequestPayload = { id: number };
