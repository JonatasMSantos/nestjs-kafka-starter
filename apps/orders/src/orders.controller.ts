import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Prisma, OrderStatus } from '.prisma/client/orders';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getHello(): Promise<any> {
    return this.ordersService.all();
  }

  @Post()
  create(@Body() data: Prisma.OrderCreateInput): Promise<any> {
    return this.ordersService.create(data);
  }

  @MessagePattern('payments')
  async complete(@Payload() message: any) {
    await this.ordersService.complete(
      message.order_id,
      message.status === 'APPROVED'
        ? OrderStatus.PAYED
        : OrderStatus.CANCELLED,
    );
  }
}
