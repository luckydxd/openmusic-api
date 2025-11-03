require("dotenv").config();

const amqp = require("amqplib");
const config = require("./config");
const PlaylistsService = require("./PlaylistsService");
const MailSender = require("./MailSender");

const init = async () => {
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();

  const connection = await amqp.connect(config.rabbitMq.server);
  const channel = await connection.createChannel();

  const queue = "export:playlists";
  await channel.assertQueue(queue, {
    durable: true,
  });

  console.log(`Waiting for messages in queue: ${queue}`);

  channel.prefetch(1);

  channel.consume(queue, async (message) => {
    try {
      const { playlistId, targetEmail } = JSON.parse(
        message.content.toString()
      );
      console.log(
        `Received export job for playlist ${playlistId} to ${targetEmail}`
      );

      const playlist = await playlistsService.getSongsFromPlaylistForExport(
        playlistId
      );
      const result = await mailSender.sendEmail(
        targetEmail,
        JSON.stringify({ playlist })
      );

      console.log(`Email sent successfully to ${targetEmail}`, result);
      channel.ack(message);
    } catch (error) {
      console.error(`Failed to process message: ${error.message}`);
      channel.ack(message);
    }
  });
};

init();
