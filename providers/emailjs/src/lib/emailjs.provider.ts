import {
  ChannelTypeEnum,
  IEmailOptions,
  IEmailProvider,
  ISendMessageSuccessResponse,
} from '@notifire/core';
import { Message, SMTPClient, MessageAttachment } from 'emailjs';
import { EmailJsConfig } from './emailjs.config';

export class EmailJsProvider implements IEmailProvider {
  readonly id = 'emailjs';
  readonly channelType = ChannelTypeEnum.EMAIL as ChannelTypeEnum.EMAIL;
  private readonly client: SMTPClient;

  constructor(private readonly config: EmailJsConfig) {
    const { host, port, secure: ssl, user, password } = this.config;
    this.client = new SMTPClient({
      host,
      port,
      ssl,
      user,
      password,
    });
  }

  async sendMessage({
    from,
    to,
    subject,
    text,
    html,
    attachments,
  }: IEmailOptions): Promise<ISendMessageSuccessResponse> {
    const attachmentsModel: MessageAttachment[] = attachments ? attachments.map(
      (attachment) => {
        return {
          name: attachment.name,
          data: attachment.file.toString(),
          type: attachment.mime,
        };
      }
    ) : [];

    attachmentsModel?.push({ data: html, alternative: true });

    const sent = await this.client.sendAsync(
      new Message({
        from: from || this.config.from,
        to,
        subject,
        text,
        attachment: attachmentsModel,
      })
    );
    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      id: sent.header['message-id']!,
      date: sent.header.date,
    };
  }
}
