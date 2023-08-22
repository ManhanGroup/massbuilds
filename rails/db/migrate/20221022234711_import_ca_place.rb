class ImportCaPlace < ActiveRecord::Migration[7.0]
  def up
    create_table "ca_place", primary_key: "gid", id: :serial, force: :cascade do |t|
      t.string "geoid"
	  t.string "placens"
	  t.string "namelsad"
	  t.geometry "geom", limit: {:srid=>4269, :type=>"multi_polygon"}
      t.index ["geom"], name: "ca_place_geom_idx", using: :gist
    end
    config   = Rails.configuration.database_configuration
    host     = config[Rails.env]["host"] ? "-h #{config[Rails.env]["host"]}" : ""
    database = config[Rails.env]["database"] ? "-d #{config[Rails.env]["database"]}" : ""
    username = config[Rails.env]["username"] ? "-U #{config[Rails.env]["username"]}" : "-U #{ENV['USER']}"
    port     = config[Rails.env]["port"] ? "-p #{config[Rails.env]["port"]}" : ""
    #pg_restore version must match the DB version
    #system("pg_restore -Fc -a -v -j 8 -t ca_place #{host} #{username} #{database} #{port} #{Rails.root}/lib/import/ca_place.dump")
  end
  def down
    drop_table :ca_place
  end
end
