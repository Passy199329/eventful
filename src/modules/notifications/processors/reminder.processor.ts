import {
    Processor,
    WorkerHost,
  } from '@nestjs/bullmq';
  
  import { Job }
  from 'bullmq';
  
  @Processor('notification-queue')
  export class ReminderProcessor
    extends WorkerHost {
  
    async process(
      job: Job<any>,
    ): Promise<any> {
  
      console.log(
        'RUNNING REMINDER JOB',
      );
  
      console.log(job.data);
  
      return true;
    }
  }