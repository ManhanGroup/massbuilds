class ImportRpaPoly < ActiveRecord::Migration[7.0]
  def up
    create_table "rpa_poly", primary_key: "rpa_id", id: :serial, force: :cascade do |t|
      t.string "rpa_name"
	  t.string "acronym"
	  t.string "website"
	  t.geometry "shape", limit: {:srid=>4269, :type=>"multi_polygon"}
      t.index ["shape"], name: "rpa_poly_shape_idx", using: :gist
    end
    config   = Rails.configuration.database_configuration
    host     = config[Rails.env]["host"] ? "-h #{config[Rails.env]["host"]}" : ""
    database = config[Rails.env]["database"] ? "-d #{config[Rails.env]["database"]}" : ""
    username = config[Rails.env]["username"] ? "-U #{config[Rails.env]["username"]}" : "-U #{ENV['USER']}"
    port     = config[Rails.env]["port"] ? "-p #{config[Rails.env]["port"]}" : ""
    #pg_restore version must match the DB version
    #system("pg_restore -Fc -a -v -j 8 -t rpa_poly #{host} #{username} #{database} #{port} #{Rails.root}/lib/import/rpa_poly.dump")
  end
  def down
    drop_table :rpa_poly
  end
end
