const { Pool } = require("pg");
const config = require("./config");

class PlaylistsService {
  constructor() {
    this._pool = new Pool({
      user: config.pg.user,
      password: config.pg.password,
      database: config.pg.database,
      host: config.pg.host,
      port: config.pg.port,
    });
  }

  async getSongsFromPlaylistForExport(playlistId) {
    const playlistQuery = {
      text: `SELECT id, name
             FROM playlists
             WHERE id = $1`,
      values: [playlistId],
    };
    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rows.length) {
      console.error(`Playlist with ID ${playlistId} not found.`);
      return null;
    }

    const songsQuery = {
      text: `SELECT s.id, s.title, s.performer
             FROM songs s
             JOIN playlistsongs ps ON s.id = ps.song_id
             WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };
    const songsResult = await this._pool.query(songsQuery);

    const playlist = playlistResult.rows[0];
    playlist.songs = songsResult.rows;

    return playlist;
  }
}

module.exports = PlaylistsService;
