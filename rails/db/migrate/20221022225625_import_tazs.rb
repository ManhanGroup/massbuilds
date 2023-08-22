class ImportTazs < ActiveRecord::Migration[7.0]
  def up
    create_table "tazs", primary_key: "id", id: :serial, force: :cascade do |t|
      t.integer "taz_number"
      t.geometry "geometry", limit: {:srid=>4269, :type=>"multi_polygon"}
      t.index ["geometry"], name: "tazs_geom_idx", using: :gist
    end
    config   = Rails.configuration.database_configuration
    host     = config[Rails.env]["host"] ? "-h #{config[Rails.env]["host"]}" : ""
    database = config[Rails.env]["database"] ? "-d #{config[Rails.env]["database"]}" : ""
    username = config[Rails.env]["username"] ? "-U #{config[Rails.env]["username"]}" : "-U #{ENV['USER']}"
    port     = config[Rails.env]["port"] ? "-p #{config[Rails.env]["port"]}" : ""
    #pg_restore version must match the DB version
    #system("pg_restore -Fc -a -v -j 8 -t tazs #{host} #{username} #{database} #{port} #{Rails.root}/lib/import/tazs.dump")
  end
  def down
    drop_table :tazs
  end
end
