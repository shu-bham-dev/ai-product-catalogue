# AWS Deployment Architecture

This solution is designed for seamless, cost-effective deployment on AWS following modern cloud-native best practices.

## Recommended AWS Deployment Options

### Option 1: AWS App Runner + S3/CloudFront (Recommended for MVP)
- **Frontend**: Built static assets hosted on **Amazon S3** fronted by **Amazon CloudFront** CDN for ultra-low latency and global caching.
- **Backend**: Containerized Node.js API hosted on **AWS App Runner** (fully managed container service, auto-scaling from 1 to N instances with zero infrastructure overhead).
- **Email Service**: Replace `MemoryEmailService` with **Amazon Simple Email Service (SES)** via AWS SDK by setting `EMAIL_PROVIDER=ses` or configuring SMTP credentials.

### Option 2: AWS ECS Fargate + ALB
- **Cluster**: AWS Elastic Container Service (ECS) with AWS Fargate (serverless containers).
- **Load Balancer**: Application Load Balancer (ALB) routing `/api/*` to backend service and static requests to frontend container or CloudFront.
- **Environment**: Secrets managed via AWS Secrets Manager or Systems Manager Parameter Store.

### Option 3: AWS Amplify Gen 2 / AWS Elastic Beanstalk
- Multi-container Docker deployment running the exact `docker-compose.yml`.

---

## AWS SES Integration Blueprint

When promoting from PoC to AWS Production, simply implement `AwsSesEmailService`:

```typescript
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { IEmailService, SendEmailResult } from "../domain/interfaces/IEmailService";

export class AwsSesEmailService implements IEmailService {
  private client = new SESClient({ region: process.env.AWS_REGION || "us-east-1" });

  async sendEnquiryEmail(enquiry: Enquiry, product: Product): Promise<SendEmailResult> {
    const command = new SendEmailCommand({
      Destination: { ToAddresses: [process.env.SALES_INBOX_EMAIL!] },
      Message: {
        Subject: { Data: `[Enquiry] #${enquiry.id}: ${product.title}` },
        Body: {
          Text: { Data: `Customer: ${enquiry.customerName}\nEmail: ${enquiry.customerEmail}\n...` },
        },
      },
      Source: process.env.SES_VERIFIED_SENDER_EMAIL!,
    });
    const res = await this.client.send(command);
    return { success: true, messageId: res.MessageId };
  }
}
```
