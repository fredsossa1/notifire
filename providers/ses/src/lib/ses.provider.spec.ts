import { SESClient } from '@aws-sdk/client-ses';
import { SESEmailProvider } from './ses.provider';

test('should trigger ses library correctly', async () => {
  const mockResponse = { MessageId: 'mock-message-id' };
  const spy = jest
    .spyOn(SESClient.prototype, 'send')
    .mockImplementation(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return mockResponse as any;
    });

  const mockConfig = {
    from: 'test@test.com',
    accessKeyId: 'TEST',
    secretAccessKey: 'TEST',
    region: 'test-1',
  };
  const provider = new SESEmailProvider(mockConfig);

  const mockNotifireMessage = {
    to: 'test@test2.com',
    subject: 'test subject',
    html: '<div> Mail Content </div>',
    attachments: [
      { mime: 'text/plain', file: Buffer.from('test'), name: 'test.txt' },
    ],
  };
  const response = await provider.sendMessage(mockNotifireMessage);

  expect(spy).toHaveBeenCalled();
  expect(response.id).toEqual(mockResponse.MessageId);
});
