const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../utils/errors/InvariantError");
const NotFoundError = require("../../utils/errors/NotFoundError");

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbumCover(id, coverUrl) {
    const query = {
      text: "UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id",
      values: [coverUrl, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        "Gagal memperbarui sampul. Album tidak ditemukan",
      );
    }
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3) RETURNING id",
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const albumQuery = {
      text: "SELECT id, name, year, cover_url FROM albums WHERE id = $1",
      values: [id],
    };
    const albumResult = await this._pool.query(albumQuery);

    if (!albumResult.rowCount) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    const songsQuery = {
      text: "SELECT id, title, performer FROM songs WHERE \"album_id\" = $1",
      values: [id],
    };
    const songsResult = await this._pool.query(songsQuery);

    const album = albumResult.rows[0];
    album.coverUrl = album.cover_url;
    delete album.cover_url;
    album.songs = songsResult.rows;

    return album;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id",
      values: [name, year, id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }

  async addAlbumLike(albumId, userId) {
    await this.getAlbumById(albumId);

    const id = `like-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id",
      values: [id, userId, albumId],
    };

    try {
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new InvariantError("Gagal menyukai album");
      }
      await this._cacheService.delete(`album_likes:${albumId}`);
    } catch (error) {
      if (error.code === "23505") {
        throw new InvariantError("Anda sudah menyukai album ini");
      }
      throw error;
    }
  }

  async deleteAlbumLike(albumId, userId) {
    const query = {
      text: "DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id",
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Gagal batal menyukai album");
    }
    await this._cacheService.delete(`album_likes:${albumId}`);
  }

  async getAlbumLikesCount(albumId) {
    try {
      const result = await this._cacheService.get(`album_likes:${albumId}`);
      return { count: parseInt(result, 10), fromCache: true };
    } catch (error) {
      const query = {
        text: "SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1",
        values: [albumId],
      };
      const result = await this._pool.query(query);
      const likesCount = parseInt(result.rows[0].count, 10);

      await this._cacheService.set(`album_likes:${albumId}`, likesCount);

      return { count: likesCount, fromCache: false };
    }
  }
}
module.exports = AlbumsService;
