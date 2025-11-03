exports.up = pgm => {
  pgm.createTable('songs', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    title: { type: 'VARCHAR(255)', notNull: true },
    year: { type: 'INTEGER', notNull: true },
    genre: { type: 'VARCHAR(100)', notNull: true },
    performer: { type: 'VARCHAR(100)', notNull: true },
    duration: { type: 'INTEGER' },
    album_id: { type: 'VARCHAR(50)', references: 'albums(id)', onDelete: 'CASCADE' },
  });
};
exports.down = pgm => {
  pgm.dropTable('songs');
};