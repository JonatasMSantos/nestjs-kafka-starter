import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma/prisma.service';
import { Prisma, PaymentStatus } from '.prisma/client/payments';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PaymentsService {
  constructor(
    private prismaService: PrismaService,
    @Inject('PAYMENTS_SERVICE') private kafkaClient: ClientKafka,
  ) {}

  all() {
    return this.prismaService.payment.findMany();
  }

  async payment(data: Prisma.PaymentCreateInput) {
    const payment = await this.prismaService.payment.create({
      data: {
        ...data,
        status: PaymentStatus.APPROVED,
      },
    });
    await lastValueFrom(this.kafkaClient.emit('payments', payment))
    return payment;
  }
}
