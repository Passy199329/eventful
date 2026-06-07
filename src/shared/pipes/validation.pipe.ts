import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
  } from '@nestjs/common';
  
  import { plainToInstance } from 'class-transformer';
  
  import { validate } from 'class-validator';
  
  @Injectable()
  export class ValidationPipe
    implements PipeTransform<any>
  {
    async transform(
      value: any,
      metadata: ArgumentMetadata,
    ) {
      const { metatype } = metadata;
  
      if (!metatype || !this.toValidate(metatype)) {
        return value;
      }
  
      const object =
        plainToInstance(
          metatype,
          value,
        );
  
      const errors =
        await validate(object);
  
      if (errors.length > 0) {
  
        const messages =
          errors.flatMap((error) =>
            Object.values(
              error.constraints || {},
            ),
          );
  
        throw new BadRequestException({
          success: false,
          message: 'Validation failed',
          errors: messages,
        });
      }
  
      return object;
    }
  
    private toValidate(
      metatype: any,
    ): boolean {
  
      const types = [
        String,
        Boolean,
        Number,
        Array,
        Object,
      ];
  
      return !types.includes(
        metatype,
      );
    }
  }