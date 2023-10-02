import { Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  all(): Promise<any> {
    return this.paymentsService.all();
  }

  @MessagePattern('orders')
  async payment(@Payload() message) {
    await this.paymentsService.payment({
      amount: message.price,
      order_id: message.id,
      client_id: message.client_id,
      status: null
    })
  }

}
