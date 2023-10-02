import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma/prisma.service';
import { Prisma, OrderStatus } from '.prisma/client/orders';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private prismaService: PrismaService,
    @Inject('ORDERS_SERVICE') private kafkaClient: ClientKafka,
  ) {}

  all(): Promise<any> {
    return this.prismaService.order.findMany();
  }

  async create(data: Prisma.OrderCreateInput): Promise<any> {
    const order = await this.prismaService.order.create({
      data: {
        ...data,
        status: OrderStatus.PENDING,
      },
    });

    console.log(order);

    await lastValueFrom(this.kafkaClient.emit('orders', order));
    return order;
  }

  complete(id: number, status: OrderStatus) {
    return this.prismaService.order.update({
      where: { id },
      data: { status },
    });
  }
}
